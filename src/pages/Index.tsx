import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { Phone, CheckCircle, Loader2 } from "lucide-react";
import hexaLogo from "@/assets/hexa-logo.png";

type CallStatus = "idle" | "calling" | "success" | "error";

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const initiateCall = async () => {
    if (!phoneNumber) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    setCallStatus("calling");
    setErrorMessage("");
    setCallDuration(0);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    try {
      const response = await fetch("https://hexaweb.haloocom.in/royal/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          campaignId: "Inbound",
          listId: "1",
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Failed to initiate call");
      }

      setCallStatus("success");
    } catch (error) {
      clearInterval(interval);
      setCallStatus("error");
      setErrorMessage("Unable to initiate call. Please try again.");
      console.error("Call error:", error);
    }
  };

  const resetForm = () => {
    setCallStatus("idle");
    setPhoneNumber(undefined);
    setCallDuration(0);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-hexa-green/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-hexa-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Logo */}
        <div className="mb-10 animate-fade-in">
          <img
            src={hexaLogo}
            alt="Hexa AI"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {callStatus === "success" ? (
          /* Success State */
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Call Initiated!
            </h2>
            <p className="text-muted-foreground mb-8">
              You will receive a call from our AI assistant shortly.
            </p>
            <button
              onClick={resetForm}
              className="px-8 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Make Another Call
            </button>
          </div>
        ) : (
          /* Main Form */
          <>
            {/* Title */}
            <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Connect with <span className="text-primary">Hexa AI</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                Enter your phone number and our AI assistant will call you right away.
              </p>
            </div>

            {/* Call Form Card */}
            <div
              className="w-full bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Phone Input Row */}
              <div className="flex flex-col gap-4 mb-4">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="w-full"
                  placeholder="Enter phone number"
                />
                <button
                  onClick={initiateCall}
                  disabled={callStatus === "calling" || !phoneNumber}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold uppercase tracking-wide hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-pulse-glow"
                >
                  {callStatus === "calling" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Calling... {callDuration}s</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>Call Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-destructive text-sm text-center mb-4">{errorMessage}</p>
              )}

              {/* Disclaimer */}
              <p className="text-muted-foreground text-xs text-center">
                By proceeding, you agree to receive a call from our AI assistant
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-muted-foreground/60 text-xs">
          Powered by Hexa AI Voice Technology
        </p>
      </div>
    </div>
  );
};

export default Index;
