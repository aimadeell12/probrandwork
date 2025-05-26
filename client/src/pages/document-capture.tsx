import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, Camera, Upload, Check, RotateCcw, User, CreditCard, RotateCw, Zap, ZapOff } from "lucide-react";

type DocumentType = "id-front" | "id-back" | "selfie";

interface CapturedDocument {
  type: DocumentType;
  image: string | null;
  captured: boolean;
}

export default function DocumentCapture() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<DocumentType>("id-front");
  const [activeCamera, setActiveCamera] = useState<DocumentType | null>(null);
  const [documents, setDocuments] = useState<CapturedDocument[]>([
    { type: "id-front", image: null, captured: false },
    { type: "id-back", image: null, captured: false },
    { type: "selfie", image: null, captured: false }
  ]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState("");

  const documentSteps = [
    { 
      type: "id-front" as DocumentType, 
      title: language === "ar" ? "الجهة الأمامية للبطاقة" : "Front of ID Card",
      description: language === "ar" ? "التقط صورة واضحة للجهة الأمامية من بطاقة الهوية" : "Take a clear photo of the front of your ID card",
      icon: CreditCard
    },
    { 
      type: "id-back" as DocumentType, 
      title: language === "ar" ? "الجهة الخلفية للبطاقة" : "Back of ID Card",
      description: language === "ar" ? "التقط صورة واضحة للجهة الخلفية من بطاقة الهوية" : "Take a clear photo of the back of your ID card",
      icon: CreditCard
    },
    { 
      type: "selfie" as DocumentType, 
      title: language === "ar" ? "صورة شخصية" : "Selfie Photo",
      description: language === "ar" ? "التقط صورة شخصية واضحة لوجهك" : "Take a clear selfie photo of your face",
      icon: User
    }
  ];

  const currentStepInfo = documentSteps.find(step => step.type === currentStep);
  const currentDocument = documents.find(doc => doc.type === currentStep);

  // Get available cameras on component mount
  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    };

    getAvailableCameras();
  }, []);

  const toggleCamera = async () => {
    if (stream && activeCamera) {
      stopCamera();
      const newFacingMode = facingMode === "user" ? "environment" : "user";
      setFacingMode(newFacingMode);
      
      // Small delay to ensure stream is properly stopped
      setTimeout(() => {
        startCamera(activeCamera);
      }, 500);
    }
  };

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }]
          });
          setFlashEnabled(!flashEnabled);
        } catch (error) {
          console.error("Flash not supported:", error);
        }
      }
    }
  };

  const startCamera = async (documentType: DocumentType) => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported");
      }

      // Enhanced camera constraints for better document scanning
      const constraints = {
        video: {
          facingMode: documentType === "selfie" ? facingMode : (facingMode === "user" ? "environment" : "environment"),
          width: { ideal: 1920, min: 640, max: 4096 },
          height: { ideal: 1080, min: 480, max: 2160 },
          // Enhanced settings for document capture
          focusMode: "continuous",
          exposureMode: "continuous",
          whiteBalanceMode: "continuous",
          zoom: documentType !== "selfie" ? 1.2 : 1.0 // Slight zoom for document clarity
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to load before showing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        
        setStream(mediaStream);
        setActiveCamera(documentType);
        
        // Start auto-detection after camera loads
        setTimeout(() => {
          startAutoDetection();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      
      let errorMessage = language === "ar" 
        ? "لا يمكن الوصول للكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح." 
        : "Unable to access camera. Please allow camera access in browser settings.";
      
      if (error?.name === "NotAllowedError") {
        errorMessage = language === "ar" 
          ? "تم رفض الوصول للكاميرا. يرجى السماح بالوصول في إعدادات المتصفح وإعادة المحاولة."
          : "Camera access denied. Please allow camera access and try again.";
      } else if (error?.name === "NotFoundError") {
        errorMessage = language === "ar"
          ? "لم يتم العثور على كاميرا. تأكد من وجود كاميرا متاحة."
          : "No camera found. Please ensure a camera is available.";
      } else if (error?.name === "NotReadableError") {
        errorMessage = language === "ar"
          ? "الكاميرا قيد الاستخدام بواسطة تطبيق آخر. أغلق التطبيقات الأخرى وحاول مرة أخرى."
          : "Camera is being used by another application. Close other apps and try again.";
      }
      
      alert(errorMessage);
    }
  };

  // Auto-detection function
  const startAutoDetection = () => {
    if (!videoRef.current || !activeCamera) return;

    setIsDetecting(true);
    setDetectionMessage(
      activeCamera === "selfie" 
        ? (language === "ar" ? "ضع وجهك في الدائرة واحتفظ بثباتك" : "Position your face in the circle and stay still")
        : (language === "ar" ? "ضع البطاقة في الإطار واحتفظ بثباتها" : "Place the card in the frame and keep it steady")
    );

    // Simulate detection with a realistic delay
    setTimeout(() => {
      if (activeCamera && isDetecting) {
        setDetectionMessage(language === "ar" ? "تم اكتشاف الهدف! جاري العد التنازلي..." : "Target detected! Countdown starting...");
        startCountdown();
      }
    }, 2000);
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        capturePhoto();
      }
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !activeCamera) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      setDocuments(prev => prev.map(doc => 
        doc.type === activeCamera 
          ? { ...doc, image: imageData, captured: true }
          : doc
      ));
      
      setIsDetecting(false);
      setCountdown(0);
      setDetectionMessage("");
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setActiveCamera(null);
  };

  const retakePhoto = (documentType: DocumentType) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === documentType 
        ? { ...doc, image: null, captured: false }
        : doc
    ));
  };

  const handleFileUpload = (documentType: DocumentType, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setDocuments(prev => prev.map(doc => 
        doc.type === documentType 
          ? { ...doc, image: imageData, captured: true }
          : doc
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const currentIndex = documentSteps.findIndex(step => step.type === currentStep);
    
    if (currentIndex < documentSteps.length - 1) {
      setCurrentStep(documentSteps[currentIndex + 1].type);
    } else {
      // جميع الصور تم التقاطها، انتقل للخطوة التالية
      setLocation("/kyc-verification");
    }
  };

  const handleBack = () => {
    const currentIndex = documentSteps.findIndex(step => step.type === currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(documentSteps[currentIndex - 1].type);
    } else {
      setLocation("/personal-information");
    }
  };

  const allDocumentsCaptured = documents.every(doc => doc.captured);
  const canProceed = currentDocument?.captured || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Enhanced Camera Modal */}
      {activeCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Camera Header */}
          <div className="flex items-center justify-between p-4 text-white bg-black/50">
            <Button 
              onClick={stopCamera} 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-white text-lg font-semibold">
              {currentStepInfo?.title || ""}
            </h3>
            
            {/* Camera Controls */}
            <div className="flex items-center gap-2">
              {/* Flash Toggle */}
              {activeCamera !== "selfie" && (
                <Button 
                  onClick={toggleFlash}
                  variant="ghost" 
                  size="sm"
                  className={`text-white hover:bg-white/10 rounded-full ${flashEnabled ? 'bg-yellow-500/20' : ''}`}
                >
                  {flashEnabled ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
                </Button>
              )}
              
              {/* Camera Switch */}
              {availableCameras.length > 1 && (
                <Button 
                  onClick={toggleCamera}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Camera View */}
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              className="w-full h-full object-cover"
              style={{ 
                transform: activeCamera === "selfie" ? "scaleX(-1)" : "none"
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Auto-Detection Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {activeCamera !== "selfie" ? (
                // Document frame guide with detection animation
                <div className="relative">
                  <div className={`w-80 h-52 border-4 rounded-2xl bg-transparent transition-all duration-500 ${
                    isDetecting ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/80'
                  }`}>
                    {/* Animated corner guides */}
                    <div className={`absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg transition-colors duration-500 ${
                      isDetecting ? 'border-green-400' : 'border-white/80'
                    }`}></div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg transition-colors duration-500 ${
                      isDetecting ? 'border-green-400' : 'border-white/80'
                    }`}></div>
                    <div className={`absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg transition-colors duration-500 ${
                      isDetecting ? 'border-green-400' : 'border-white/80'
                    }`}></div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 rounded-br-lg transition-colors duration-500 ${
                      isDetecting ? 'border-green-400' : 'border-white/80'
                    }`}></div>

                    {/* Scanning animation */}
                    {isDetecting && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400/60 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-400/60 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Countdown display */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold animate-ping">
                        {countdown}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Selfie circle guide with detection
                <div className="relative">
                  <div className={`w-64 h-80 border-4 rounded-full bg-transparent transition-all duration-500 ${
                    isDetecting ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/80'
                  }`}>
                    {/* Face position indicators */}
                    <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full transition-colors duration-500 ${
                      isDetecting ? 'bg-green-400' : 'bg-white/80'
                    }`}></div>
                    <div className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-500 ${
                      isDetecting ? 'bg-green-400' : 'bg-white/80'
                    }`}></div>

                    {/* Face detection animation */}
                    {isDetecting && (
                      <div className="absolute inset-4 border-2 border-green-400/40 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Countdown display */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold animate-ping">
                        {countdown}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Auto-Detection Status */}
          <div className="bg-black/80 p-6">
            {/* Detection Status */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                {isDetecting ? (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                )}
                <p className="text-white text-lg font-medium">
                  {language === "ar" ? "التصوير التلقائي" : "Auto Capture"}
                </p>
              </div>
              
              {/* Detection Message */}
              <p className="text-white/80 text-sm mb-4">
                {detectionMessage || (
                  activeCamera === "selfie" 
                    ? (language === "ar" ? "ضع وجهك في الدائرة وانتظر التصوير التلقائي" : "Position your face in the circle and wait for auto capture")
                    : (language === "ar" ? "ضع البطاقة في الإطار وانتظر التصوير التلقائي" : "Place the card in the frame and wait for auto capture")
                )}
              </p>

              {/* Progress Indicator */}
              <div className="flex justify-center">
                <div className={`w-32 h-1 bg-white/20 rounded-full overflow-hidden ${isDetecting ? 'bg-green-400/20' : ''}`}>
                  {isDetecting && (
                    <div className="h-full bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Auto-Detection Status Icons */}
            <div className="flex justify-center items-center gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDetecting ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/60'
                }`}>
                  <Camera className="h-4 w-4" />
                </div>
                <span className="text-xs text-white/60 mt-1">
                  {language === "ar" ? "الكشف" : "Detection"}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  countdown > 0 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white/60'
                }`}>
                  <span className="text-sm font-bold">
                    {countdown > 0 ? countdown : "3"}
                  </span>
                </div>
                <span className="text-xs text-white/60 mt-1">
                  {language === "ar" ? "العد" : "Timer"}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white/60">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs text-white/60 mt-1">
                  {language === "ar" ? "التقاط" : "Capture"}
                </span>
              </div>
            </div>

            {/* Manual Override */}
            <div className="flex justify-center mt-6">
              <Button 
                onClick={capturePhoto} 
                variant="outline"
                className="border-white/20 text-white/60 hover:bg-white/5 text-sm"
              >
                {language === "ar" ? "التقاط يدوي" : "Manual Capture"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-8">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
              {language === "ar" ? "تصوير الوثائق" : "Document Capture"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              {language === "ar" 
                ? "يرجى التقاط صور واضحة لوثائق الهوية والصورة الشخصية."
                : "Please capture clear photos of your identity documents and selfie."
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {documentSteps.map((step, index) => (
              <div
                key={step.type}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step.type === currentStep
                    ? "bg-white"
                    : documents.find(doc => doc.type === step.type)?.captured
                    ? "bg-green-400"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                {currentStepInfo?.icon && <currentStepInfo.icon className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{currentStepInfo?.title || ""}</h3>
                <p className="text-white/70 text-sm">{currentStepInfo?.description || ""}</p>
              </div>
            </div>

            {currentDocument?.image ? (
              <div className="space-y-4">
                <img
                  src={currentDocument.image}
                  alt={currentStepInfo?.title}
                  className="w-full h-48 object-cover rounded-xl border border-gray-600"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={() => retakePhoto(currentStep)}
                    variant="outline" 
                    className="flex-1 border-gray-600 text-white hover:bg-white/10 rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {language === "ar" ? "إعادة التقاط" : "Retake"}
                  </Button>
                  <div className="flex items-center text-green-400">
                    <Check className="h-5 w-5 mr-2" />
                    <span className="text-sm">{language === "ar" ? "تم" : "Done"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    {currentStepInfo?.icon && <currentStepInfo.icon className="h-8 w-8 text-gray-400" />}
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    {language === "ar" ? "اختر طريقة التقاط الصورة" : "Choose capture method"}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => startCamera(currentStep)}
                    className="flex-1 bg-white text-black hover:bg-gray-100 rounded-xl"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {language === "ar" ? "فتح الكاميرا" : "Open Camera"}
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(currentStep, file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-white hover:bg-white/10 rounded-xl px-4"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {language === "ar" ? "رفع" : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {documentSteps.findIndex(step => step.type === currentStep) > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-white/10 rounded-full h-12"
              >
                {language === "ar" ? "السابق" : "Previous"}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-white text-black font-semibold rounded-full hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 transition-all duration-200 h-12"
            >
              {allDocumentsCaptured ? 
                (language === "ar" ? "إنهاء" : "Finish") : 
                (language === "ar" ? "التالي" : "Next")
              }
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-white/30 rounded-full">
              <div 
                className="h-1 bg-white rounded-full transition-all duration-300"
                style={{ width: `${((documentSteps.findIndex(step => step.type === currentStep) + 1) / documentSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}