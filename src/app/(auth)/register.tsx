import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuthMutations } from "../../features/auth/hooks/useAuthMutations";

export default function RegisterScreen() {
  const { signupMutation } = useAuthMutations();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = () => {
    if (!agreeTerms) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!fullName || !email || !password) return;
    signupMutation.mutate({ fullName, email, password, phoneNumber: phone, acceptedTerms: agreeTerms });
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign-In will be implemented soon.");
  };

  const handleContinueAsGuest = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered Logo */}
          <View className="items-center mt-1 mb-2">
            <Image
              source={require("../../../assets/images/city-deals-logo.png")}
              className="h-12 w-40"
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <View className="items-center mb-4">
            <Text className="text-lg font-bold text-neutral-900 tracking-tight">
              Create Account
            </Text>
            <Text className="text-neutral-500 text-base text-center mt-1 max-w-xs">
              Let's get started! Please fill in the details below to create your
              account.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-y-3">
            {/* Full Name */}
            <View>
              <Text className="text-neutral-700 text-base font-semibold mb-1">
                Full Name
              </Text>
              <View className="flex-row items-center border border-neutral-200 rounded-xl px-3.5 h-12 bg-white focus:border-orange-500">
                <Feather name="user" size={18} color="#ea580c" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-2.5 text-neutral-900 text-base py-0"
                />
              </View>
            </View>

            {/* Email Address */}
            <View>
              <Text className="text-neutral-700 text-base font-semibold mb-1">
                Email Address
              </Text>
              <View className="flex-row items-center border border-neutral-200 rounded-xl px-3.5 h-12 bg-white focus:border-orange-500">
                <Feather name="mail" size={18} color="#ea580c" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-2.5 text-neutral-900 text-base py-0"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View>
              <Text className="text-neutral-700 text-base font-semibold mb-1">
                Phone Number
              </Text>
              <View className="flex-row items-center border border-neutral-200 rounded-xl px-3.5 h-12 bg-white focus:border-orange-500">
                <Feather name="phone" size={18} color="#ea580c" />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  className="flex-1 ml-2.5 text-neutral-900 text-base py-0"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-neutral-700 text-base font-semibold mb-1">
                Password
              </Text>
              <View className="flex-row items-center border border-neutral-200 rounded-xl px-3.5 h-12 bg-white focus:border-orange-500">
                <Feather name="lock" size={18} color="#ea580c" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-2.5 text-neutral-900 text-base py-0"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-neutral-700 text-base font-semibold mb-1">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-neutral-200 rounded-xl px-3.5 h-12 bg-white focus:border-orange-500">
                <Feather name="lock" size={18} color="#ea580c" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 ml-2.5 text-neutral-900 text-base py-0"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions Checkbox */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAgreeTerms(!agreeTerms)}
              className="flex-row items-center mt-0.5"
            >
              <View
                className={`w-5 h-5 rounded items-center justify-center border ${
                  agreeTerms
                    ? "bg-orange-500 border-orange-500"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {agreeTerms && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-neutral-700 text-base ml-2">
                I agree to the{" "}
                <Text className="text-orange-600 font-semibold">
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Create Account CTA */}
            <PrimaryButton
              title="Create Account"
              onPress={handleCreateAccount}
              loading={signupMutation.isPending}
              className="mt-1"
            />

            {/* Divider */}
            <View className="flex-row items-center my-1">
              <View className="flex-1 h-[1px] bg-neutral-200" />
              <Text className="px-3 text-neutral-400 text-base font-medium">
                or
              </Text>
              <View className="flex-1 h-[1px] bg-neutral-200" />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGoogleSignIn}
              className="w-full bg-neutral-50 border border-neutral-200 h-12 rounded-xl flex-row items-center justify-center active:bg-neutral-100"
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text className="text-neutral-800 font-semibold text-base ml-2.5">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Footer Log In Link */}
            <View className="flex-row justify-center items-center mt-1">
              <Text className="text-neutral-500 text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/login" as any)}
              >
                <Text className="text-orange-600 font-bold text-base">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            {/* Continue as Guest Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleContinueAsGuest}
              className="items-center justify-center py-2 mt-1"
            >
              <Text className="text-neutral-500 font-semibold text-base underline">
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
