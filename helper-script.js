// --- NEW: Import Firebase functions ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { 
    getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", function() {

    // --- NEW: Firebase Initialization ---
    const firebaseConfig = window.firebaseConfig || JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    const appId = window.appId || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    const initialAuthToken = window.initialAuthToken || (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);

    let db, auth, userId, dbCollection;

    if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                dbCollection = collection(db, `artifacts/${appId}/public/data/notes`);
                runHelperLogic(); // Run all logic AFTER auth
            } else {
                if (initialAuthToken) {
                    try {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } catch (error) {
                        console.error("Custom auth failed:", error);
                        await signInAnonymously(auth);
                    }
                } else {
                    await signInAnonymously(auth);
                }
            }
        });
    } else {
        console.warn("Firebase config not found. Note-sending will not work.");
        runHelperLogic(); // Run logic anyway, but note features will be disabled
    }

    // --- NEW: All helper-specific code is now inside this function ---
    function runHelperLogic() {
    
        // --- 5. NEW: Helper Page Note Logic ---
        const sendNoteBtn = document.getElementById('send-note-btn');
        const noteText = document.getElementById('note-text');
        const notesList = document.getElementById('notes-list');
        const successMsg = document.getElementById('send-success-msg');

        if (sendNoteBtn) {
            // Check if Firebase is working
            if (!db) {
                if (notesList) notesList.innerHTML = "<p>Note system is not available right now.</p>";
                sendNoteBtn.disabled = true;
                return;
            }

            // 1. Send Note Logic
            sendNoteBtn.addEventListener('click', async () => {
                const message = noteText.value;
                if (!message.trim()) {
                    alert("Please write a note first!"); 
                    return;
                }

                try {
                    await addDoc(dbCollection, {
                        text: message,
                        senderId: userId, // Store who sent it
                        timestamp: serverTimestamp() // Order by time
                    });

                    // Show success message
                    successMsg.classList.remove('hidden');
                    noteText.value = ""; // Clear the box
                    setTimeout(() => successMsg.classList.add('hidden'), 3000);

                } catch (error) {
                    console.error("Error sending note: ", error);
                    alert("Could not send note, please try again.");
                }
            });

            // 2. Listen for new notes and display them
            const q = query(dbCollection); // Simple query
            onSnapshot(q, (snapshot) => {
                let notes = [];
                snapshot.forEach(doc => {
                    notes.push({ id: doc.id, ...doc.data() });
                });

                // Sort notes by timestamp in JavaScript
                notes.sort((a, b) => {
                    const aTime = a.timestamp ? a.timestamp.toMillis() : 0;
                    const bTime = b.timestamp ? b.timestamp.toMillis() : 0;
                    return bTime - aTime; // Newest first
                });

                // Display notes
                if (notesList) {
                    notesList.innerHTML = ""; // Clear the list
                    if (notes.length === 0) {
                        notesList.innerHTML = "<p>No notes yet. Be the first!</p>";
                    } else {
                        notes.forEach(note => {
                            const noteEl = document.createElement('div');
                            noteEl.classList.add('note-item');
                            
                            const text = document.createElement('p');
                            text.textContent = note.text;
                            
                            const time = document.createElement('span');
                            time.textContent = note.timestamp ? note.timestamp.toDate().toLocaleString() : 'Just now';

                            noteEl.appendChild(text);
                            noteEl.appendChild(time);
                            notesList.appendChild(noteEl);
                        });
                    }
                }
            });
        }
    }
}); // End of DOMContentLoaded
