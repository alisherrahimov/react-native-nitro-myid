import Foundation
import UIKit
import MyIdSDK
import NitroModules

class NitroMyid: HybridNitroMyidSpec {
    
    // MARK: - Callbacks
    private var onSuccessCallback: ((_ result: MyIdResult) -> Void)?
    private var onErrorCallback: ((_ error: MyIdError) -> Void)?
    private var onUserExitedCallback: (() -> Void)?
    
    // MARK: - HybridNitroMyidSpec
    
    func start(
        config: MyIdConfig,
        onSuccess: @escaping (_ result: MyIdResult) -> Void,
        onError: @escaping (_ error: MyIdError) -> Void,
        onUserExited: @escaping () -> Void
    ) throws {
        // Store callbacks
        self.onSuccessCallback = onSuccess
        self.onErrorCallback = onError
        self.onUserExitedCallback = onUserExited
        
        // Build SDK config
        let sdkConfig = MyIdSDK.MyIdConfig()
        sdkConfig.sessionId = config.sessionId
        sdkConfig.clientHash = config.clientHash
        sdkConfig.clientHashId = config.clientHashId
        
        // Map optional config values
        if let locale = config.locale {
            sdkConfig.locale = mapLocale(locale)
        }
        if let environment = config.environment {
            sdkConfig.environment = mapEnvironment(environment)
        }
        if let entryType = config.entryType {
            sdkConfig.entryType = mapEntryType(entryType)
        }
        if let residency = config.residency {
            sdkConfig.residency = mapResidency(residency)
        }
        if let cameraShape = config.cameraShape {
            sdkConfig.cameraShape = mapCameraShape(cameraShape)
        }
        if let minAge = config.minAge {
            sdkConfig.minAge = Int(minAge)
        }
        if let showErrorScreen = config.showErrorScreen {
            sdkConfig.showErrorScreen = showErrorScreen
        }
        
        // Apply appearance customization
        if let appearance = config.appearance {
            sdkConfig.appearance = buildAppearance(appearance)
        }
        
        // Apply organization details
        if let orgDetails = config.organizationDetails {
            sdkConfig.organizationDetails = buildOrganizationDetails(orgDetails)
        }
        
        // Start SDK on main thread
        DispatchQueue.main.async {
            MyIdClient.start(withConfig: sdkConfig, withDelegate: self)
        }
    }
    
    // MARK: - Appearance Builder
    
    private func buildAppearance(_ appearance: MyIdAppearance) -> MyIdSDK.MyIdAppearance {
        let sdkAppearance = MyIdSDK.MyIdAppearance()
        
        if let colorPrimary = appearance.colorPrimary {
            sdkAppearance.colorPrimary = UIColor(hex: colorPrimary)
        }
        if let colorOnPrimary = appearance.colorOnPrimary {
            sdkAppearance.colorOnPrimary = UIColor(hex: colorOnPrimary)
        }
        if let colorError = appearance.colorError {
            sdkAppearance.colorError = UIColor(hex: colorError)
        }
        if let colorOnError = appearance.colorOnError {
            sdkAppearance.colorOnError = UIColor(hex: colorOnError)
        }
        if let colorOutline = appearance.colorOutline {
            sdkAppearance.colorOutline = UIColor(hex: colorOutline)
        }
        if let colorDivider = appearance.colorDivider {
            sdkAppearance.colorDivider = UIColor(hex: colorDivider)
        }
        if let colorSuccess = appearance.colorSuccess {
            sdkAppearance.colorSuccess = UIColor(hex: colorSuccess)
        }
        if let colorButtonContainer = appearance.colorButtonContainer {
            sdkAppearance.colorButtonContainer = UIColor(hex: colorButtonContainer)
        }
        if let colorButtonContainerDisabled = appearance.colorButtonContainerDisabled {
            sdkAppearance.colorButtonContainerDisabled = UIColor(hex: colorButtonContainerDisabled)
        }
        if let colorButtonContent = appearance.colorButtonContent {
            sdkAppearance.colorButtonContent = UIColor(hex: colorButtonContent)
        }
        if let colorButtonContentDisabled = appearance.colorButtonContentDisabled {
            sdkAppearance.colorButtonContentDisabled = UIColor(hex: colorButtonContentDisabled)
        }
        if let colorScanButtonContainer = appearance.colorScanButtonContainer {
            sdkAppearance.colorScanButtonContainer = UIColor(hex: colorScanButtonContainer)
        }
        if let buttonCornerRadius = appearance.buttonCornerRadius {
          sdkAppearance.buttonCornerRadius = Float(CGFloat(buttonCornerRadius))
        }
        
        return sdkAppearance
    }
    
    // MARK: - Organization Details Builder
    
    private func buildOrganizationDetails(_ details: MyIdOrganizationDetails) -> MyIdSDK.MyIdOrganizationDetails {
        let orgDetails = MyIdSDK.MyIdOrganizationDetails()
        
        if let phoneNumber = details.phoneNumber {
            orgDetails.phoneNumber = phoneNumber
        }
        if let logoBase64 = details.logo,
           let imageData = Data(base64Encoded: logoBase64),
           let image = UIImage(data: imageData) {
            orgDetails.logo = image
        }
        
        return orgDetails
    }
    
    // MARK: - Enum Mappers
    
    private func mapLocale(_ locale: MyIdLocale) -> MyIdSDK.MyIdLocale {
        switch locale {
        case .en: return .english
        case .ru: return .russian
        case .uz: return .uzbek
        }
    }
    
    private func mapEnvironment(_ env: MyIdEnvironment) -> MyIdSDK.MyIdEnvironment {
        switch env {
        case .sandbox: return .debug
        case .production: return .production
        }
    }
    
    private func mapEntryType(_ type: MyIdEntryType) -> MyIdSDK.MyIdEntryType {
        switch type {
        case .facedetection: return .faceDetection
        case .identification: return .identification
        }
    }
    
    private func mapResidency(_ residency: MyIdResidency) -> MyIdSDK.MyIdResidency {
        switch residency {
        case .nonresident: return .nonResident
        case .userdefined: return .userDefined
        case .resident: return .resident
        }
    }
    
    private func mapCameraShape(_ shape: MyIdCameraShape) -> MyIdSDK.MyIdCameraShape {
        switch shape {
        case .ellipse: return .ellipse
        case .circle: return .circle
        }
    }
}

// MARK: - MyIdClientDelegate

extension NitroMyid: MyIdClientDelegate {
    func onSuccess(result: MyIdSDK.MyIdResult) {
        let base64Image = result.image?.pngData()?.base64EncodedString() ?? ""
        let mappedResult = MyIdResult(
            code: result.code ?? "",
            base64Image: base64Image
        )
        onSuccessCallback?(mappedResult)
    }
    
    func onError(exception: MyIdException) {
        let error = MyIdError(
            code: Double(exception.code),
            message: exception.message ?? ""
        )
        onErrorCallback?(error)
    }
    
    func onUserExited() {
        onUserExitedCallback?()
    }
    
    func onEvent(event: MyIdEvent) {
        // Optional: handle SDK events for debugging/analytics
        print("MyIdSDK Event: \(event.rawValue)")
    }
}

// MARK: - UIColor Hex Extension

extension UIColor {
    convenience init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)
        
        let r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
        let g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
        let b = CGFloat(rgb & 0x0000FF) / 255.0
        
        self.init(red: r, green: g, blue: b, alpha: 1.0)
    }
}
