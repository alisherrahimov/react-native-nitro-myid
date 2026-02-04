#include <jni.h>
#include "nitromyidOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitromyid::initialize(vm);
}
