import { useState, useEffect, useRef } from "react";
import styles from "./TimerModal.module.css";

export default function TimerModal({ isOpen, onClose, onConfirm, resumingTime, onCancelTimer }) {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(5);
  const [isClosing, setIsClosing] = useState(false);
  const [remainingTime, setRemainingTime] = useState(resumingTime);

  const hoursRef = useRef([]);
  const minutesRef = useRef([]);
  const modalRef = useRef(null);
  const intervalRef = useRef(null);

  const hours = Array.from({ length: 13 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

  useEffect(() => {
    if (hoursRef.current[selectedHour]) {
      hoursRef.current[selectedHour].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedHour]);

  useEffect(() => {
    if (minutesRef.current[selectedMinute / 5 - 1]) {
      minutesRef.current[selectedMinute / 5 - 1].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedMinute]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (resumingTime) {
      setRemainingTime(resumingTime);
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            onClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [resumingTime, onClose]);

  const handleWheel = (e, type) => {
    e.preventDefault();
    if (type === "hour") {
      if (e.deltaY < 0 && selectedHour > 0) {
        setSelectedHour(selectedHour - 1);
      } else if (e.deltaY > 0 && selectedHour < hours.length - 1) {
        setSelectedHour(selectedHour + 1);
      }
    } else if (type === "minute") {
      if (e.deltaY < 0 && selectedMinute > 5) {
        setSelectedMinute(selectedMinute - 5);
      } else if (e.deltaY > 0 && selectedMinute < minutes[minutes.length - 1]) {
        setSelectedMinute(selectedMinute + 5);
      }
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    let startY = e.clientY;

    const onMouseMove = (e) => {
      const deltaY = startY - e.clientY;
      if (type === "hour") {
        if (deltaY > 10 && selectedHour < hours.length - 1) {
          setSelectedHour((prev) => prev + 1);
          startY = e.clientY;
        } else if (deltaY < -10 && selectedHour > 0) {
          setSelectedHour((prev) => prev - 1);
          startY = e.clientY;
        }
      } else if (type === "minute") {
        if (deltaY > 10 && selectedMinute < minutes[minutes.length - 1]) {
          setSelectedMinute((prev) => prev + 5);
          startY = e.clientY;
        } else if (deltaY < -10 && selectedMinute > 5) {
          setSelectedMinute((prev) => prev - 5);
          startY = e.clientY;
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm(selectedHour * 3600 + selectedMinute * 60);
    handleClose();
  };

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onCancelTimer();
    handleClose();
  };

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

  useEffect(() => {
    if (!isOpen && !isClosing) {
      setSelectedHour(0);
      setSelectedMinute(5);
      setRemainingTime(null);
    }
  }, [isOpen, isClosing]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.slideDown : styles.slideUp} fixed inset-0 flex justify-center items-end z-10`}>
      <div ref={modalRef} className={`${styles.modalContent} ${isClosing ? styles.slideDownContent : styles.slideUpContent} bg-gray-200 w-full max-w-lg p-4 shadow-lg`}>
        {/* Header Buttons */}
        <div className="flex justify-end text-teal-500 mb-2">
          <button
            onClick={resumingTime ? handleCancel : handleClose}
            className="text-[14px] p-2 mr-4 font-medium"
            style={{ color: "#3aad94" }}
          >
            {resumingTime ? "CANCEL TIMER" : "CANCEL"}
          </button>
          <button onClick={resumingTime ? handleClose : handleConfirm} className="text-[14px] p-2 font-medium" style={{ color: "#3aad94" }}>{resumingTime ? "HIDE" : "CONFIRM"}</button>
        </div>

        {resumingTime ? (
          <div className="flex justify-center py-20 space-x-24">
            <h2 className="text-2xl" style={{ color: "#3aad94" }}>
              Stop after: {formatTime(remainingTime)}
            </h2>
          </div>
        ) : (
        <div className="flex justify-center pt-10 space-x-44">
          {/* Hours Column */}
          <div className="text-center" onWheel={(e) => handleWheel(e, "hour")} onMouseDown={(e) => handleDrag(e, "hour")}>
            <p className="text-gray-500 text-lg mb-2" style={{ color: "#6b6d6f" }}>Hours</p>
            <div className="h-32 overflow-hidden">
              <div className="scrollable">
                {hours.map((hour) => (
                  <p
                    key={hour}
                    ref={(el) => (hoursRef.current[hour] = el)}
                    className={`cursor-pointer py-2 px-8 text-xl ${hour === selectedHour ? styles.selected : "text-black"}`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center" onWheel={(e) => handleWheel(e, "minute")} onMouseDown={(e) => handleDrag(e, "minute")}>
            <p className="text-gray-500 text-lg mb-2" style={{ color: "#6b6d6f" }}>Minutes</p>
            <div className="h-32 overflow-hidden">
              <div className="scrollable">
                {minutes.map((minute, index) => (
                  <p
                    key={minute}
                    ref={(el) => (minutesRef.current[index] = el)}
                    className={`cursor-pointer py-2 px-8 text-xl ${minute === selectedMinute ? styles.selected : "text-black"}`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}