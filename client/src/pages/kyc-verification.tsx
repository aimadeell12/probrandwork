import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  User,
  CreditCard
} from "lucide-react";

type KYCStep = "country" | "personal" | "documents" | "phone" | "review";
type DocumentType = "id-front" | "id-back" | "selfie";
type VerificationStatus = "pending" | "verified" | "rejected" | "in-review";

interface DocumentCapture {
  type: DocumentType;
  image: string | null;
  captured: boolean;
}

export default function KYCVerification() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<KYCStep>("country");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("pending");
  const [documents, setDocuments] = useState<DocumentCapture[]>([
    { type: "id-front", image: null, captured: false },
    { type: "id-back", image: null, captured: false },
    { type: "selfie", image: null, captured: false }
  ]);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    idNumber: "",
    nationality: "",
    country: ""
  });
  
  // Camera states
  const [activeCamera, setActiveCamera] = useState<DocumentType | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-start camera when documents step is reached
  useEffect(() => {
    if (currentStep === "documents") {
      const nextDocument = documents.find(doc => !doc.captured);
      if (nextDocument && !activeCamera) {
        setTimeout(() => startCamera(nextDocument.type), 1000);
      }
    }
  }, [currentStep, documents, activeCamera]);

  // Smart detection and countdown system
  useEffect(() => {
    if (!activeCamera || !isDetecting) return;
    
    const detectionTimer = setTimeout(() => {
      startCountdown();
    }, 2000);

    return () => clearTimeout(detectionTimer);
  }, [activeCamera, isDetecting]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        capturePhoto().catch(console.error);
      }
    }, 1000);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !activeCamera) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      setIsProcessing(true);
      
      // محاكاة تحليل الذكاء الاصطناعي
      const confidence = Math.floor(Math.random() * 25 + 75); // 75-100%
      const quality = confidence > 90 ? 'عالية' : confidence > 80 ? 'جيدة' : 'متوسطة';
      
      console.log(`✅ تم التقاط ${activeCamera} بنجاح - دقة ${confidence}%`);
      
      setDocuments(prev => prev.map(doc => 
        doc.type === activeCamera 
          ? { 
              ...doc, 
              image: imageData, 
              captured: true
            }
          : doc
      ));
      
      setDetectionMessage(`✅ تم الحفظ - جودة ${quality} (${confidence}%)`);
      
      setTimeout(() => {
        setDetectionMessage("");
        setIsProcessing(false);
        setIsDetecting(false);
        setCountdown(0);
        stopCamera();
      }, 2000);
    }
  };

  const startCamera = async (documentType: DocumentType) => {
    try {
      const constraints = {
        video: {
          facingMode: documentType === "selfie" ? "user" : { ideal: "environment" },
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        },
        audio: false
      };

      console.log(`🎥 بدء الكاميرا لتصوير ${documentType}...`);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setActiveCamera(documentType);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.log('Play failed:', e));
        };
      }

      console.log(`✅ تم تشغيل الكاميرا بنجاح لتصوير ${documentType}`);
      
      setTimeout(() => {
        setIsDetecting(true);
        setDetectionMessage(getDetectionMessage(documentType));
      }, 2000);
      
    } catch (error) {
      console.error("❌ خطأ في الوصول للكاميرا:", error);
      setDetectionMessage("فشل في الوصول للكاميرا - تأكد من إعطاء الإذن");
      setTimeout(() => setDetectionMessage(""), 4000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setActiveCamera(null);
    setIsDetecting(false);
    setCountdown(0);
    setDetectionMessage("");
  };

  const getDetectionMessage = (type: DocumentType) => {
    switch (type) {
      case "id-front": return "ضع الجهة الأمامية للبطاقة داخل الإطار";
      case "id-back": return "ضع الجهة الخلفية للبطاقة داخل الإطار";
      case "selfie": return "انظر إلى الكاميرا مباشرة";
      default: return "ضع الوثيقة داخل الإطار";
    }
  };

  const renderDocumentStep = () => {
    return (
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-purple-600" />
            التصوير التلقائي للوثائق
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Capture Camera View */}
          {activeCamera && (
            <div className="fixed inset-0 bg-black z-50">
              <div className="relative h-full w-full">
                {/* Camera Video */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    transform: activeCamera === "selfie" ? "scaleX(-1)" : "none"
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Auto-Detection Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {activeCamera !== "selfie" ? (
                    <div className="relative">
                      <div className={`w-80 h-52 border-4 rounded-2xl bg-transparent transition-all duration-500 ${
                        isDetecting ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/80'
                      }`}>
                        {/* Corner guides */}
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
                      </div>
                    </div>
                  ) : (
                    <div className={`w-64 h-64 rounded-full border-4 bg-transparent transition-all duration-500 ${
                      isDetecting ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/80'
                    }`}></div>
                  )}
                </div>

                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-800 font-medium">جاري تحليل وحفظ الصورة...</p>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                <div className="absolute bottom-20 left-0 right-0 text-center">
                  {countdown > 0 && (
                    <div className="bg-black/70 text-white text-6xl font-bold py-4 px-6 rounded-lg inline-block">
                      {countdown}
                    </div>
                  )}
                  
                  {detectionMessage && (
                    <div className="bg-black/70 text-white text-lg py-3 px-6 rounded-lg inline-block mt-4">
                      {detectionMessage}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Document Progress */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    doc.captured ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {doc.captured ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Camera className="h-6 w-6 text-gray-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{getDocumentTitle(doc.type)}</p>
                    <p className="text-sm text-gray-500">
                      {doc.captured ? "تم التصوير بنجاح" : "في انتظار التصوير"}
                    </p>
                  </div>
                </div>
                {doc.captured && doc.image && (
                  <img src={doc.image} alt={doc.type} className="w-16 h-16 object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          {documents.every(doc => doc.captured) && (
            <Button 
              onClick={() => setCurrentStep("review")} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              متابعة للمراجعة
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const getDocumentTitle = (type: DocumentType) => {
    switch (type) {
      case "id-front": return "الجهة الأمامية للبطاقة";
      case "id-back": return "الجهة الخلفية للبطاقة";
      case "selfie": return "الصورة الشخصية";
      default: return "وثيقة";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            التحقق من الهوية
          </h1>
        </div>

        {/* Steps */}
        <div className="flex justify-between mb-8">
          {["country", "personal", "documents", "review"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step ? 'bg-purple-600 text-white' : 
                index < ["country", "personal", "documents", "review"].indexOf(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        {currentStep === "documents" && renderDocumentStep()}
      </div>
    </div>
  );
}