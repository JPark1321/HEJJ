
let recognition;
let transcript = '';
let shouldRestart = true;
let speechBuffer = '';
let lastBufferFlush = Date.now();
const bufferFlushInterval = '';

const emergencyKeywords = [
    "help", "ow", "please stop", "abuse", "i'm scared", "punch", "chocking",
    "violent", "shut up", "bitch", "whore", "fuck", "shut the fuck up", "kill", 
];

const immediateDangerPhrases = [
    "trying to kill",
    "going to kill",
    "he is trying to kill me",
    "he's trying to kill me",
    "holding a knife",
    "has a gun",
    "threatening me",
    "trying to harm me",
    "he's going to kill me",
    "he is going to kill me"
  ];
  

function checkSpeechBuffer() {
    const bufferedSpeech = speechBuffer.trim().toLowerCase();
    console.log("🧹 Analyzing speech buffer:", bufferedSpeech);

    if (bufferedSpeech.length === 0) {
        console.log("🛑 Buffer empty. Nothing to analyze");
        return;
    }

    const immediateDangerDetected = immediateDangerPhrases.some(phrase => bufferedSpeech.includes(phrase));
    if (immediateDangerDetected) {
        console.log("🚨 Immediate danger detected! Showing popup...");
        const continueShopping = confirm("🛒 Item added to cart! Would you like to continue shopping?");
        if (!continueShopping) {
            stopRecognition();
        }
        speechBuffer = ''; // ✅ Only clear after real danger confirmed
        return;
    }

    // First: Direct keyword detection
    const emergencyDetected = emergencyKeywords.some(keyword => bufferedSpeech.includes(keyword));

    // Force log what keywords matched
    if (emergencyDetected) {
        console.log("⚡ Emergency keyword(s) detected! Sending to AI for analysis:", bufferedSpeech);
        analyzeTranscriptWithChatGPT(bufferedSpeech)
            .catch(error => {
                console.error("❗ Error analyzing buffered transcript:", error);
            });
    } else {
        console.log("✅ No emergency keywords found in:", bufferedSpeech);
    }

    
}


function startRecognition() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.error('SpeechRecognition is not supported in this browser.');
        return;
    }

    if (recognition) {
        recognition.abort();
    }

    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
    };

    recognition.onresult = (event) => {
      
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const currentTranscript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                speechBuffer += currentTranscript + ' ';
                checkSpeechBuffer(); 
            } else {
                interimTranscript += currentTranscript;
            }
        }

        const combinedTranscript = (speechBuffer + interimTranscript).toLowerCase();
        // console.clear();
        console.log('📝 Live Transcript:', combinedTranscript);

        const now = Date.now();
        if (now - lastBufferFlush > bufferFlushInterval) {
            console.log("buffer flush interval reached");
            lastBufferFlush = now; 
            checkSpeechBuffer();
        }
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
        shouldRestart = false;
        recognition.stop();
        console.log('🛑 Stopping speech recognition...');
    }
}

async function analyzeTranscriptWithChatGPT(transcript) {
    const apiKey = API_KEY;
    

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `
You are an emergency threat detection AI.
You will be given short or long transcript excerpts. 
If the transcript contains any direct mentions of serious danger, such as:
- Violence
- Threats to kill
- Weapons (knife, gun)
- Death threats
- Begging for help
- Physical assault

Then you must IMMEDIATELY flag it as an emergency.
If there is any uncertainty, YOU MUST assume it IS an emergency.

EVEN SHORT TRANSCRIPTS like:
- "He's trying to kill me"
- "He has a knife"
- "Help me please"
should ALWAYS return emergency: true.

Return your result ONLY in strict JSON format:
{ "emergency": true }  or  { "emergency": false }

⚠️ If in doubt, ALWAYS return { "emergency": true }.
DO NOT add any extra text.
                        `
                    },
                    {
                        role: "user",
                        content: `Transcript: "${transcript}". Is this a situation that needs immediate police intervention?`
                    }
                ],
                temperature: 0
            })
        });

        const data = await response.json();
        
        // ✅ Check if choices exist
        if (!data.choices || !data.choices.length) {
            throw new Error('No choices returned from OpenAI API');
        }

        const replyContent = data.choices[0].message.content.trim();
        console.log('🧠 AI reply:', replyContent);

        const parsedReply = JSON.parse(replyContent);

        if (parsedReply.emergency) {
            console.log("🚨 Dire situation confirmed! Stopping recognition...");
            const continueShopping = confirm("Would you like to continue shopping?");
            stopRecognition();
        } else {
            console.log('✅ Not a dire emergency. Continuing...');
            speechBuffer = '';
        }

    } catch (error) {
        console.error('❗ Error during AI analysis:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    startRecognition();
});