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
  const { t } = useLanguage();
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
  const [activeCamera, setActiveCamera] = useState<DocumentType | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // تحميل بيانات المستخدم المسجل دخوله
  useEffect(() => {
    if (user && user.firstName && user.lastName) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`
      }));
    }
  }, [user]);

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
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Auto-detection function
  const startAutoDetection = () => {
    if (!videoRef.current || !activeCamera) return;

    setIsDetecting(true);
    const { language } = useLanguage();
    setDetectionMessage(
      activeCamera === "selfie" 
        ? (language === "ar" ? "ضع وجهك في الدائرة واحتفظ بثباتك" : "Position your face in the circle and stay still")
        : (language === "ar" ? "ضع البطاقة في الإطار واحتفظ بثباتها" : "Place the card in the frame and keep it steady")
    );

    // Simulate detection with a realistic delay
    setTimeout(() => {
      if (activeCamera && isDetecting) {
        const { language } = useLanguage();
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

  const submitVerification = async () => {
    setVerificationStatus("in-review");
    
    // Simulate API call
    setTimeout(() => {
      setVerificationStatus("verified");
    }, 3000);
  };

  const getStepStatus = (step: KYCStep) => {
    if (step === "country" && personalInfo.country) return "completed";
    if (step === "personal" && personalInfo.fullName && personalInfo.idNumber) return "completed";
    if (step === "documents" && documents.every(doc => doc.captured)) return "completed";
    if (step === "review" && verificationStatus === "verified") return "completed";
    return currentStep === step ? "active" : "pending";
  };

  const renderCountryStep = () => {
    const countries = [
      { code: "SA", name: "السعودية", nameEn: "Saudi Arabia" },
      { code: "AE", name: "الإمارات", nameEn: "United Arab Emirates" },
      { code: "EG", name: "مصر", nameEn: "Egypt" },
      { code: "JO", name: "الأردن", nameEn: "Jordan" },
      { code: "LB", name: "لبنان", nameEn: "Lebanon" },
      { code: "MA", name: "المغرب", nameEn: "Morocco" },
      { code: "TN", name: "تونس", nameEn: "Tunisia" },
      { code: "DZ", name: "الجزائر", nameEn: "Algeria" },
      { code: "IQ", name: "العراق", nameEn: "Iraq" },
      { code: "SY", name: "سوريا", nameEn: "Syria" },
      { code: "KW", name: "الكويت", nameEn: "Kuwait" },
      { code: "QA", name: "قطر", nameEn: "Qatar" },
      { code: "BH", name: "البحرين", nameEn: "Bahrain" },
      { code: "OM", name: "عمان", nameEn: "Oman" },
      { code: "YE", name: "اليمن", nameEn: "Yemen" },
      { code: "LY", name: "ليبيا", nameEn: "Libya" },
      { code: "SD", name: "السودان", nameEn: "Sudan" },
      { code: "PS", name: "فلسطين", nameEn: "Palestine" },
      { code: "US", name: "الولايات المتحدة", nameEn: "United States" },
      { code: "GB", name: "المملكة المتحدة", nameEn: "United Kingdom" },
      { code: "FR", name: "فرنسا", nameEn: "France" },
      { code: "DE", name: "ألمانيا", nameEn: "Germany" },
      { code: "CA", name: "كندا", nameEn: "Canada" },
      { code: "AU", name: "أستراليا", nameEn: "Australia" }
    ];

    const { language } = useLanguage();

    return (
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("selectCountry")}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            {t("selectCountryDesc")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {countries.map((country) => (
              <div
                key={country.code}
                onClick={() => {
                  setPersonalInfo(prev => ({...prev, country: country.code, nationality: language === "ar" ? country.name : country.nameEn}));
                  setCurrentStep("personal");
                }}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  personalInfo.country === country.code
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs font-semibold">
                      {country.code}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {language === "ar" ? country.name : country.nameEn}
                    </span>
                  </div>
                  {personalInfo.country === country.code && (
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPersonalInfoStep = () => (
    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="h-6 w-6 text-purple-600" />
          {t("personalInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              الاسم الكامل
            </div>
            <Input
              id="fullName"
              value={`${user?.firstName || 'Aimad'} ${user?.lastName || 'Eloirraki'}`}
              readOnly
              className="bg-white/80 dark:bg-gray-700/80"
            />
          </div>
          
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              تاريخ الميلاد
            </div>
            <Input
              id="dateOfBirth"
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={(e) => setPersonalInfo(prev => ({...prev, dateOfBirth: e.target.value}))}
              className="bg-white/80 dark:bg-gray-700/80"
            />
          </div>
          
          <div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              رقم الهوية
            </div>
            <Input
              id="idNumber"
              value={personalInfo.idNumber}
              onChange={(e) => setPersonalInfo(prev => ({...prev, idNumber: e.target.value}))}
              placeholder="أدخل رقم الهوية"
              className="bg-white/80 dark:bg-gray-700/80"
            />
          </div>

        </div>
        
        <Button 
          onClick={() => setCurrentStep("documents")} 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={!personalInfo.fullName || !personalInfo.idNumber}
        >
          {t("continue")}
        </Button>
      </CardContent>
    </Card>
  );

  const renderDocumentStep = () => {
    // Auto-start camera for the first uncaptured document
    const nextDocument = documents.find(doc => !doc.captured);
    if (nextDocument && !activeCamera) {
      setTimeout(() => startCamera(nextDocument.type), 500);
    }

    return (
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-purple-600" />
          {t("documentVerification")}
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
                {/* Detection Status */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {isDetecting ? (
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                    )}
                    <p className="text-white text-lg font-medium">
                      التصوير التلقائي
                    </p>
                  </div>
                  
                  {/* Detection Message */}
                  <p className="text-white/80 text-sm mb-4">
                    {detectionMessage || (
                      activeCamera === "selfie" 
                        ? "ضع وجهك في الدائرة وانتظر التصوير التلقائي"
                        : "ضع البطاقة في الإطار وانتظر التصوير التلقائي"
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

                {/* Manual Override & Cancel */}
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={capturePhoto} 
                    variant="outline"
                    className="border-white/20 text-white/60 hover:bg-white/5 text-sm"
                  >
                    التقاط يدوي
                  </Button>
                  <Button 
                    onClick={stopCamera} 
                    variant="outline"
                    className="border-white/20 text-white/60 hover:bg-white/5 text-sm"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Document Status */}
        {!activeCamera && (
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              التصوير التلقائي جاري التحضير...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              سيتم فتح الكاميرا تلقائياً لتصوير المستندات المطلوبة
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-6 space-y-3">
              {documents.map((doc, index) => (
                <div key={doc.type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {doc.type === "selfie" ? (
                      <User className="h-5 w-5 text-purple-600" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    )}
                    <span className="text-sm font-medium">
                      {doc.type === "id-front" && "الجهة الأمامية للبطاقة"}
                      {doc.type === "id-back" && "الجهة الخلفية للبطاقة"}
                      {doc.type === "selfie" && "الصورة الشخصية"}
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
          </div>
        )}
        
        <Button 
          onClick={() => setCurrentStep("review")} 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={!documents.every(doc => doc.captured)}
        >
          {t("continue")}
        </Button>
      </CardContent>
    </Card>
    );
  };

  const renderReviewStep = () => (
    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-purple-600" />
          {t("reviewInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Status */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          {verificationStatus === "pending" && (
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-12 w-12 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("verificationPending")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("verificationPendingDesc")}</p>
            </div>
          )}
          
          {verificationStatus === "in-review" && (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin">
                <Clock className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("verificationInReview")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("verificationInReviewDesc")}</p>
            </div>
          )}
          
          {verificationStatus === "verified" && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("verificationComplete")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("verificationCompleteDesc")}</p>
            </div>
          )}
          
          {verificationStatus === "rejected" && (
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("verificationRejected")}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t("verificationRejectedDesc")}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">{t("submittedInformation")}</h4>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t("fullName")}:</span>
              <span className="text-gray-900 dark:text-white">{personalInfo.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t("idNumber")}:</span>
              <span className="text-gray-900 dark:text-white">{personalInfo.idNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t("documentsSubmitted")}:</span>
              <span className="text-gray-900 dark:text-white">{documents.filter(doc => doc.captured).length}/3</span>
            </div>
          </div>
        </div>
        
        {verificationStatus === "pending" && (
          <Button 
            onClick={submitVerification}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t("submitVerification")}
          </Button>
        )}
        
        {verificationStatus === "verified" && (
          <Link href="/dashboard">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              {t("continueToDashboard")}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("identityVerification")}</h1>
          <div></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
            {[
              { step: "country" as KYCStep, icon: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: t("country") },
              { step: "personal" as KYCStep, icon: User, label: t("personal") },
              { step: "documents" as KYCStep, icon: CreditCard, label: t("documents") },
              { step: "review" as KYCStep, icon: CheckCircle2, label: t("review") }
            ].map(({ step, icon: Icon, label }, index) => {
              const status = getStepStatus(step);
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    status === "completed" 
                      ? "bg-green-500 text-white" 
                      : status === "active"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "country" && renderCountryStep()}
        {currentStep === "personal" && renderPersonalInfoStep()}
        {currentStep === "documents" && renderDocumentStep()}
        {currentStep === "review" && renderReviewStep()}
      </div>
    </div>
  );
}