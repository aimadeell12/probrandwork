import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Clock,
  User,
  CreditCard,
  Check
} from "lucide-react";

type DocumentType = "id-front" | "id-back" | "selfie";

interface DocumentCapture {
  type: DocumentType;
  image: string | null;
  captured: boolean;
}

export default function AutoKYC() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentCapture[]>([
    { type: "id-front", image: null, captured: false },
    { type: "id-back", image: null, captured: false },
    { type: "selfie", image: null, captured: false }
  ]);
  const [activeCamera, setActiveCamera] = useState<DocumentType | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState("");
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Auto-start camera for next document
  useEffect(() => {
    const nextDocument = documents.find(doc => !doc.captured);
    if (nextDocument && !activeCamera) {
      setTimeout(() => {
        startCamera(nextDocument.type);
      }, 1000);
    }
  }, [documents, activeCamera]);

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
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(language === "ar" ? "تعذر الوصول للكاميرا. تحقق من الأذونات." : "Unable to access camera. Please check permissions.");
    }
  };

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
    setIsDetecting(false);
    setCountdown(0);
    setDetectionMessage("");
  };

  const getDocumentTitle = (type: DocumentType) => {
    switch (type) {
      case "id-front": return language === "ar" ? "الجهة الأمامية للبطاقة" : "Front of ID Card";
      case "id-back": return language === "ar" ? "الجهة الخلفية للبطاقة" : "Back of ID Card";
      case "selfie": return language === "ar" ? "الصورة الشخصية" : "Selfie Photo";
      default: return "";
    }
  };

  const allDocumentsCaptured = documents.every(doc => doc.captured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === "ar" ? "التصوير التلقائي للهوية" : "Auto ID Verification"}
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Auto-Capture Camera View */}
        {activeCamera && (
          <div className="fixed inset-0 bg-black z-50">
            <div className="relative h-full w-full">
              {/* Camera Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
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

              {/* Auto-Detection Status */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6">
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
                  
                  <p className="text-white/80 text-sm mb-4">
                    {detectionMessage || (
                      activeCamera === "selfie" 
                        ? (language === "ar" ? "ضع وجهك في الدائرة وانتظر التصوير التلقائي" : "Position your face in the circle and wait for auto capture")
                        : (language === "ar" ? "ضع البطاقة في الإطار وانتظر التصوير التلقائي" : "Place the card in the frame and wait for auto capture")
                    )}
                  </p>

                  <div className="flex justify-center">
                    <div className={`w-32 h-1 bg-white/20 rounded-full overflow-hidden ${isDetecting ? 'bg-green-400/20' : ''}`}>
                      {isDetecting && (
                        <div className="h-full bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={capturePhoto} 
                    variant="outline"
                    className="border-white/20 text-white/60 hover:bg-white/5 text-sm"
                  >
                    {language === "ar" ? "التقاط يدوي" : "Manual Capture"}
                  </Button>
                  <Button 
                    onClick={stopCamera} 
                    variant="outline"
                    className="border-white/20 text-white/60 hover:bg-white/5 text-sm"
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!activeCamera && (
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Camera className="h-6 w-6 text-purple-600" />
                {language === "ar" ? "التصوير التلقائي للوثائق" : "Auto Document Capture"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!allDocumentsCaptured ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {language === "ar" ? "التصوير التلقائي جاري التحضير..." : "Auto Capture Preparing..."}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {language === "ar" ? "سيتم فتح الكاميرا تلقائياً لتصوير المستندات المطلوبة" : "Camera will open automatically to capture required documents"}
                  </p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {language === "ar" ? "تم التقاط جميع الصور!" : "All Photos Captured!"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {language === "ar" ? "تمت عملية التصوير بنجاح" : "Photo capture completed successfully"}
                  </p>
                </div>
              )}
              
              {/* Progress Indicator */}
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={doc.type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.type === "selfie" ? (
                        <User className="h-5 w-5 text-purple-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      )}
                      <span className="text-sm font-medium">
                        {getDocumentTitle(doc.type)}
                      </span>
                    </div>
                    {doc.captured ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>

              {allDocumentsCaptured && (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {language === "ar" ? "إنهاء التحقق" : "Complete Verification"}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}