let recognition;
let transcript = '';
let shouldRestart = true;

const emergencyKeywords = [
    "help", "ow", "please stop", "abuse", "i'm scared", "punch", "fight", "chocking",
    "screaming", "violent", "shut up", "bitch", "whore", "fuck", "shut the fuck up"
];

function startRecognition() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.error('SpeechRecognition is not supported in this browser.');
        return;
    }

    if (recognition) {
        recognition.abort(); // Safely reset any old session
    }

    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
    };

    recognition.onresult = (event) => {
        console.log('🎯 onresult event fired');
        let fullTranscript = transcript;
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const currentTranscript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                fullTranscript += currentTranscript + ' ';
                transcript = fullTranscript;
            } else {
                interimTranscript += currentTranscript;
            }
        }

        console.clear();
        console.log('📝 Live Transcript:', fullTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
        if (event.error === 'aborted') {
            console.warn('⚠️ Speech recognition aborted (normal if stopped manually)');
        } else {
            console.error('❗ Speech recognition error:', event.error);
        }
    };

    recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
        if (shouldRestart) {
            console.log('🔄 Restarting recognition...');
            recognition.start();
        }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            recognition.start();
        })
        .catch((err) => {
            console.error('Microphone permission denied:', err);
        });
}

function stopRecognition() {
    if (recognition) {
        shouldRestart = false; // 🛑 Don't auto-restart if we want to stop
        recognition.stop();
        console.log('🛑 Stopping speech recognition...');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Start recording automatically when page loads
    startRecognition();

    // Handle button clicks
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonId = event.target.id;

            if (buttonId === 'add-custom-pizza') {
                // If "Add to Cart" (submit) clicked, stop recording
                stopRecognition();
                console.log('🛑 Stopped because user submitted order.');
            } else {
                console.log('✅ Button clicked: still recording...');
                // No need to restart manually — already recording
            }
        });
    });
});
