import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Upload, AlertCircle, Camera, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  documentType: string;
  idNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

type VerificationStatus = "not_started" | "pending" | "verified" | "rejected";

export default function KYCVerificationNew() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("not_started");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    dateOfBirth: "",
    documentType: "",
    idNumber: "",
    address: "",
    city: "",
    postalCode: ""
  });

  // Camera states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // تحميل حالة التحقق عند تحميل الصفحة
  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await fetch('/api/kyc/status');
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          setVerificationStatus(data.status);
          if (data.personalInfo) {
            setPersonalInfo(data.personalInfo);
          }
        }
      }
    } catch (error) {
      console.log('No saved KYC data found');
    }
  };

  const validateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const isStep1Valid = () => {
    return personalInfo.fullName && 
           personalInfo.dateOfBirth && 
           validateAge(personalInfo.dateOfBirth) &&
           personalInfo.documentType && 
           personalInfo.idNumber;
  };

  const isStep2Valid = () => {
    return personalInfo.address && 
           personalInfo.city && 
           personalInfo.postalCode;
  };

  const isStep3Valid = () => {
    return capturedImage !== null;
  };

  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera...');
      
      // إعدادات بسيطة للكاميرا
      const constraints = {
        video: {
          facingMode: 'environment',
          width: 640,
          height: 480
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('📱 Camera permission granted');
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // ضبط خصائص الفيديو
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        videoRef.current.muted = true;
        
        // تشغيل الفيديو عند تحميل البيانات
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().then(() => {
            console.log('✅ Video is now playing');
          }).catch(error => {
            console.error('❌ Video play error:', error);
          });
        });
        
        // محاولة تشغيل فوري
        setTimeout(() => {
          videoRef.current?.play().catch(console.error);
        }, 100);
      }
      
    } catch (error) {
      console.error('❌ Camera error:', error);
      setIsCameraOpen(false);
      
      let message = 'Camera access failed. ';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          message += 'Please allow camera permission and try again.';
        } else if (error.name === 'NotFoundError') {
          message += 'No camera found on device.';
        } else {
          message += error.message;
        }
      }
      alert(message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitVerification = async () => {
    try {
      const formData = {
        nationality: "Saudi Arabia",
        firstName: personalInfo.fullName.split(' ')[0] || '',
        lastName: personalInfo.fullName.split(' ').slice(1).join(' ') || '',
        dateOfBirth: personalInfo.dateOfBirth,
        documentType: personalInfo.documentType,
        idNumber: personalInfo.idNumber,
        phoneNumber: (user as any)?.phone || '',
        email: (user as any)?.email || '',
        streetAddress: personalInfo.address,
        city: personalInfo.city,
        postalCode: personalInfo.postalCode
      };

      console.log('📋 Submitting KYC verification:', formData);

      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ KYC verification saved successfully:', result);
        setVerificationStatus("pending");
        setCurrentStep(3);
      } else {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        alert('Error submitting verification: ' + errorData.message);
      }
    } catch (error) {
      console.error('❌ Error submitting KYC verification:', error);
      alert('Error submitting verification. Please try again.');
    }
  };

  // إذا كان التحقق مكتملاً أو قيد المراجعة، عرض الحالة
  if (verificationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
            <div></div>
          </div>

          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ✅ Verification Under Review
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your identity verification is currently being reviewed by our team. We'll notify you once the process is complete.
              </p>
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Return to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationStatus === "verified") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
            <div></div>
          </div>

          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ✅ Verification Completed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your identity has been successfully verified! You now have full access to all banking features.
              </p>
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                  Return to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
          <div></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                }`}>
                  {step}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {step === 1 ? "Personal" : step === 2 ? "Address" : step === 3 ? "ID Photo" : "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {currentStep === 1 ? "Personal Information" : 
               currentStep === 2 ? "Address Information" : 
               currentStep === 3 ? "ID Document Photo" : "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, fullName: e.target.value}))}
                    placeholder="Enter your full name"
                    className="bg-white/80 dark:bg-gray-700/80"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, dateOfBirth: e.target.value}))}
                    className="bg-white/80 dark:bg-gray-700/80"
                  />
                  {personalInfo.dateOfBirth && !validateAge(personalInfo.dateOfBirth) && (
                    <p className="text-red-500 text-sm mt-1">You must be 18 years or older</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Document Type
                  </label>
                  <Select value={personalInfo.documentType} onValueChange={(value) => setPersonalInfo(prev => ({...prev, documentType: value}))}>
                    <SelectTrigger className="bg-white/80 dark:bg-gray-700/80">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    ID Number
                  </label>
                  <Input
                    value={personalInfo.idNumber}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, idNumber: e.target.value}))}
                    placeholder="Enter your ID number"
                    className="bg-white/80 dark:bg-gray-700/80"
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Valid()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Street Address
                  </label>
                  <Input
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo(prev => ({...prev, address: e.target.value}))}
                    placeholder="Enter street name and number"
                    className="bg-white/80 dark:bg-gray-700/80"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      City
                    </label>
                    <Input
                      value={personalInfo.city}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, city: e.target.value}))}
                      placeholder="Enter city name"
                      className="bg-white/80 dark:bg-gray-700/80"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      Postal Code
                    </label>
                    <Input
                      value={personalInfo.postalCode}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, postalCode: e.target.value}))}
                      placeholder="Enter postal code"
                      className="bg-white/80 dark:bg-gray-700/80"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!isStep2Valid()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: ID Document Photo */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Take a Photo of Your ID Document
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please take a clear photo of your {personalInfo.documentType.replace('_', ' ')}. Ensure all text is readable and the document is well-lit.
                  </p>
                </div>

                {!capturedImage && !isCameraOpen && (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-4">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Click the button below to start your camera and take a photo
                      </p>
                      <Button
                        onClick={startCamera}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}

                {isCameraOpen && (
                  <div className="text-center">
                    <div className="relative mb-4 bg-black rounded-lg overflow-hidden mx-auto max-w-md">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover"
                        autoPlay
                        playsInline
                        muted
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      <div className="absolute inset-4 border-2 border-white/70 rounded-lg pointer-events-none">
                        <div className="absolute -top-8 left-0 right-0 text-white text-sm bg-black/70 p-2 rounded text-center">
                          Position your ID within the white frame
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="flex-1 max-w-32"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 max-w-32 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="text-center">
                    <div className="mb-4">
                      <img
                        src={capturedImage}
                        alt="Captured ID"
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />
                    </div>
                    <p className="text-green-600 dark:text-green-400 mb-4 font-semibold">
                      ✅ Photo captured successfully!
                    </p>
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="mb-6"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Photo
                    </Button>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    disabled={!isStep3Valid()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue
                  </Button>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Review Your Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.documentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">ID Number:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.idNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">City:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Postal Code:</span>
                      <span className="text-gray-900 dark:text-white">{personalInfo.postalCode}</span>
                    </div>
                  </div>

                  {capturedImage && (
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900 dark:text-white">ID Document Photo</h5>
                      <div className="text-center">
                        <img
                          src={capturedImage}
                          alt="ID Document"
                          className="w-full max-w-xs mx-auto rounded-lg shadow-md border"
                        />
                        <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                          ✅ Document photo captured
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={submitVerification}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Submit Verification
                  </Button>
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}