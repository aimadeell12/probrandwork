import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, Camera, Upload, Check, RotateCcw, User, CreditCard } from "lucide-react";

type DocumentType = "id-front" | "id-back" | "selfie";

export default function CameraTest() {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<DocumentType>("id-front");
  const [activeCamera, setActiveCamera] = useState<DocumentType | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  const startCamera = async (documentType: DocumentType) => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported");
      }

      // Request camera permissions with better mobile support
      const constraints = {
        video: {
          facingMode: documentType === "selfie" ? "user" : "environment",
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          // Add mobile-specific constraints
          aspectRatio: 16/9
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
      }
      
      alert(errorMessage);
    }
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
      setCapturedImage(imageData);
      
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

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <h1 className="text-xl font-bold">
          {language === "ar" ? "اختبار الكاميرا" : "Camera Test"}
        </h1>
      </div>

      {/* Camera Modal */}
      {activeCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl p-6 m-4 max-w-md w-full">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">
              {currentStepInfo?.title || ""}
            </h3>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                className="w-full rounded-xl object-cover aspect-video"
                style={{ 
                  transform: activeCamera === "selfie" ? "scaleX(-1)" : "none",
                  maxHeight: "60vh"
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={capturePhoto} className="bg-white text-black hover:bg-gray-100 rounded-full px-6">
                <Camera className="h-5 w-5 mr-2" />
                {language === "ar" ? "التقاط" : "Capture"}
              </Button>
              <Button onClick={stopCamera} variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-6">
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 pb-8">
        <div className="space-y-8 w-full max-w-md">
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

            {capturedImage ? (
              <div className="space-y-4">
                <img
                  src={capturedImage}
                  alt={currentStepInfo?.title}
                  className="w-full h-48 object-cover rounded-xl border border-gray-600"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={retakePhoto}
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
                    {language === "ar" ? "اختبر الكاميرا" : "Test Camera"}
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
                </div>
              </div>
            )}
          </div>

          {/* Step Selector */}
          <div className="flex gap-2 justify-center">
            {documentSteps.map((step) => (
              <Button
                key={step.type}
                onClick={() => setCurrentStep(step.type)}
                variant={currentStep === step.type ? "default" : "outline"}
                className={`${
                  currentStep === step.type 
                    ? "bg-white text-black" 
                    : "border-gray-600 text-white hover:bg-white/10"
                } rounded-xl px-4 py-2`}
              >
                <step.icon className="h-4 w-4 mr-2" />
                {step.type === "selfie" 
                  ? (language === "ar" ? "سيلفي" : "Selfie")
                  : step.type === "id-front"
                  ? (language === "ar" ? "أمامي" : "Front")
                  : (language === "ar" ? "خلفي" : "Back")
                }
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}