import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  startMyId,
  MyIdLocale,
  MyIdEnvironment,
  MyIdEntryType,
  MyIdCameraShape,
  type MyIdResult,
} from 'react-native-nitro-myid';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MyIdResult | null>(null);

  const handleStartVerification = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const verificationResult = await startMyId({
        // Replace with your actual credentials from MyID
        sessionId: 'YOUR_SESSION_ID',
        clientHash: 'YOUR_CLIENT_HASH',
        clientHashId: 'YOUR_CLIENT_HASH_ID',

        // Optional configuration
        locale: MyIdLocale.EN,
        environment: MyIdEnvironment.SANDBOX,
        entryType: MyIdEntryType.IDENTIFICATION,
        cameraShape: MyIdCameraShape.CIRCLE,
        showErrorScreen: true,

        // Optional organization branding
        organizationDetails: {
          phoneNumber: '+998901234567',
        },
      });

      setResult(verificationResult);
      Alert.alert(
        'Success',
        `Verification completed!\nCode: ${verificationResult.code}`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MyID Demo</Text>
            <Text style={styles.subtitle}>Biometric Identification</Text>
          </View>

          {/* Result Display */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Verification Result</Text>

              {result.base64Image ? (
                <Image
                  source={{
                    uri: `data:image/png;base64,${result.base64Image}`,
                  }}
                  style={styles.faceImage}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.resultInfo}>
                <Text style={styles.resultLabel}>Code:</Text>
                <Text style={styles.resultValue}>{result.code}</Text>
              </View>
            </View>
          )}

          {/* Start Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleStartVerification}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Start Verification</Text>
            )}
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoText}>
              1. Tap "Start Verification" to begin{'\n'}
              2. Position your face in the camera frame{'\n'}
              3. Follow the on-screen instructions{'\n'}
              4. Receive your verification result
            </Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>Powered by MyID SDK + Nitro Modules</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  faceImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 24,
  },
  footer: {
    fontSize: 12,
    color: '#999999',
    marginTop: 'auto',
    paddingTop: 24,
  },
});
