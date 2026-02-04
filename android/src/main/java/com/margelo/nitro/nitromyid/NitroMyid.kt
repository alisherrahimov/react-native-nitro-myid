package com.margelo.nitro.nitromyid

// Import from MyID SDK - main capture classes
// Import from MyID SDK - model enums
import android.app.Activity
import android.graphics.Bitmap
import android.util.Base64
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import java.io.ByteArrayOutputStream
import uz.myid.android.sdk.capture.MyIdClient
import uz.myid.android.sdk.capture.MyIdConfig as SdkConfig
import uz.myid.android.sdk.capture.MyIdException as SdkException
import uz.myid.android.sdk.capture.MyIdResult as SdkResult
import uz.myid.android.sdk.capture.MyIdResultListener
import uz.myid.android.sdk.capture.model.MyIdCameraShape as SdkCameraShape
import uz.myid.android.sdk.capture.model.MyIdEntryType as SdkEntryType
import uz.myid.android.sdk.capture.model.MyIdEnvironment as SdkEnvironment
import uz.myid.android.sdk.capture.model.MyIdEvent as SdkEvent
import uz.myid.android.sdk.capture.model.MyIdGraphicFieldType
import uz.myid.android.sdk.capture.model.MyIdLocale as SdkLocale
import uz.myid.android.sdk.capture.model.MyIdOrganizationDetails as SdkOrganizationDetails
import uz.myid.android.sdk.capture.model.MyIdResidency as SdkResidency

@DoNotStrip
@Keep
class NitroMyid : HybridNitroMyidSpec(), MyIdResultListener {

  private var onSuccessCallback: ((MyIdResult) -> Unit)? = null
  private var onErrorCallback: ((MyIdError) -> Unit)? = null
  private var onUserExitedCallback: (() -> Unit)? = null

  private val myIdClient = MyIdClient()

  // Activity reference - should be set before calling start
  var activity: Activity? = null

  companion object {
    const val REQUEST_CODE_MY_ID = 1001
  }

  override fun start(
          config: MyIdConfig,
          onSuccess: (result: MyIdResult) -> Unit,
          onError: (error: MyIdError) -> Unit,
          onUserExited: () -> Unit
  ) {
    // Store callbacks
    onSuccessCallback = onSuccess
    onErrorCallback = onError
    onUserExitedCallback = onUserExited

    // Build SDK config
    val sdkConfigBuilder =
            SdkConfig.Builder(config.sessionId)
                    .withClientHash(config.clientHash, config.clientHashId)

    // Map optional config values
    config.locale?.let { locale: MyIdLocale ->
      val sdkLocale =
              when (locale) {
                MyIdLocale.EN -> SdkLocale.English
                MyIdLocale.RU -> SdkLocale.Russian
                MyIdLocale.UZ -> SdkLocale.Uzbek
              }
      sdkConfigBuilder.withLocale(sdkLocale)
    }

    config.environment?.let { env: MyIdEnvironment ->
      val sdkEnv =
              when (env) {
                MyIdEnvironment.SANDBOX -> SdkEnvironment.Debug
                MyIdEnvironment.PRODUCTION -> SdkEnvironment.Production
              }
      sdkConfigBuilder.withEnvironment(sdkEnv)
    }

    config.entryType?.let { type: MyIdEntryType ->
      val sdkType =
              when (type) {
                MyIdEntryType.IDENTIFICATION -> SdkEntryType.Identification
                MyIdEntryType.FACEDETECTION -> SdkEntryType.FaceDetection
              }
      sdkConfigBuilder.withEntryType(sdkType)
    }

    config.residency?.let { res: MyIdResidency ->
      val sdkRes =
              when (res) {
                MyIdResidency.RESIDENT -> SdkResidency.Resident
                MyIdResidency.NONRESIDENT -> SdkResidency.NonResident
                MyIdResidency.USERDEFINED -> SdkResidency.UserDefined
              }
      sdkConfigBuilder.withResidency(sdkRes)
    }

    config.cameraShape?.let { shape: MyIdCameraShape ->
      val sdkShape =
              when (shape) {
                MyIdCameraShape.CIRCLE -> SdkCameraShape.Circle
                MyIdCameraShape.ELLIPSE -> SdkCameraShape.Ellipse
              }
      sdkConfigBuilder.withCameraShape(sdkShape)
    }

    config.minAge?.let { sdkConfigBuilder.withMinAge(it.toInt()) }
    config.showErrorScreen?.let { sdkConfigBuilder.withErrorScreen(it) }

    // Organization details
    config.organizationDetails?.let { orgDetails: MyIdOrganizationDetails ->
      val phoneNumber = orgDetails.phoneNumber
      val logoName = orgDetails.logo

      // Get logo resource ID from drawable name
      val logoResId: Int? =
              if (!logoName.isNullOrEmpty()) {
                activity?.resources?.getIdentifier(logoName, "drawable", activity?.packageName)
                        ?.takeIf { it != 0 }
              } else {
                null
              }

      val sdkOrgDetails = SdkOrganizationDetails(phoneNumber = phoneNumber ?: "", logo = logoResId)
      sdkConfigBuilder.withOrganizationDetails(sdkOrgDetails)
    }

    val sdkConfig = sdkConfigBuilder.build()

    // Get current activity and start SDK
    val currentActivity = activity
    if (currentActivity != null) {
      myIdClient.startActivityForResult(currentActivity, REQUEST_CODE_MY_ID, sdkConfig, this)
    } else {
      onError(
              MyIdError(
                      code = -1.0,
                      message = "No activity available. Set activity before calling start()."
              )
      )
    }
  }

  // MARK: - MyIdResultListener

  override fun onSuccess(result: SdkResult) {
    // Get face portrait bitmap from result
    val facePortrait = result.getGraphicFieldImageByType(MyIdGraphicFieldType.FacePortrait)

    val base64Image =
            facePortrait?.let { bitmap: Bitmap ->
              val stream = ByteArrayOutputStream()
              bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
              Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
            }
                    ?: ""

    val mappedResult = MyIdResult(code = result.code ?: "", base64Image = base64Image)
    onSuccessCallback?.invoke(mappedResult)
  }

  override fun onError(exception: SdkException) {
    val error = MyIdError(code = exception.code.toDouble(), message = exception.message ?: "")
    onErrorCallback?.invoke(error)
  }

  override fun onUserExited() {
    onUserExitedCallback?.invoke()
  }

  override fun onEvent(event: SdkEvent) {
    // Optional: Can expose events if needed in future
    // For now, we just handle success/error/userExited
  }
}
