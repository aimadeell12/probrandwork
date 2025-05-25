import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, Camera, Upload, Check, RotateCcw, User, CreditCard } from "lucide-react";

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

  const startCamera = async (documentType: DocumentType) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: documentType === "selfie" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setActiveCamera(documentType);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(language === "ar" ? "لا يمكن الوصول للكاميرا. تحقق من الصلاحيات." : "Unable to access camera. Please check permissions.");
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
      
      setDocuments(prev => prev.map(doc => 
        doc.type === activeCamera 
          ? { ...doc, image: imageData, captured: true }
          : doc
      ));
      
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
                className="w-full rounded-xl"
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
                    <currentStepInfo.icon className="h-8 w-8 text-gray-400" />
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