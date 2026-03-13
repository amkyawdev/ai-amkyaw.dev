/*
 * Amkyaw.Dev - Firebase Authentication
 * Handles user registration, login, and password reset
 */

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
    authDomain: "smart-burme-app.firebaseapp.com",
    projectId: "smart-burme-app",
    storageBucket: "smart-burme-app.appspot.com",
    messagingSenderId: "851502425686",
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
};

// Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User logged in:', user.email);
        // Update UI
        updateAuthUI(user);
        // Store user data
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userUid', user.uid);
    } else {
        console.log('User logged out');
        updateAuthUI(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userUid');
    }
});

// Update Auth UI
function updateAuthUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    if (!authButtons || !userProfile) return;
    
    if (user) {
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        
        if (userName) userName.textContent = user.displayName || 'User';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Register New User
async function registerUser(email, password, displayName) {
    try {
        showLoading('Creating account...');
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        await user.updateProfile({
            displayName: displayName
        });
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Send email verification
        await user.sendEmailVerification();
        
        hideLoading();
        showNotification('Account created! Please check your email to verify.', 'success');
        
        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 2000);
        
        return { success: true, user: user };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Login User
async function loginUser(email, password, rememberMe = false) {
    try {
        showLoading('Logging in...');
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check if email is verified
        if (!user.emailVerified) {
            hideLoading();
            showNotification('Please verify your email first. Check your inbox.', 'warning');
            await auth.signOut();
            return { success: false, error: 'Email not verified' };
        }
        
        // Update last login
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Remember me persistence
        if (rememberMe) {
            auth.persistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
            auth.persistence(firebase.auth.Auth.Persistence.SESSION);
        }
        
        hideLoading();
        showNotification('Login successful!', 'success');
        
        // Redirect to chat page
        setTimeout(() => {
            window.location.href = 'pages/chat.html';
        }, 1000);
        
        return { success: true, user: user };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Reset Password
async function resetPassword(email) {
    try {
        showLoading('Sending reset email...');
        
        await auth.sendPasswordResetEmail(email);
        
        hideLoading();
        showNotification('Password reset email sent! Check your inbox.', 'success');
        
        return { success: true };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Sign Out
async function signOutUser() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
        return { success: true };
    } catch (error) {
        showNotification('Error logging out', 'error');
        return { success: false, error: error.message };
    }
}

// Google Sign In
async function signInWithGoogle() {
    try {
        showLoading('Signing in with Google...');
        
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // Create new user document
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                provider: 'google'
            });
        } else {
            // Update last login
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        hideLoading();
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'pages/chat.html';
        }, 1000);
        
        return { success: true, user: user };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Facebook Sign In
async function signInWithFacebook() {
    try {
        showLoading('Signing in with Facebook...');
        
        const provider = new firebase.auth.FacebookAuthProvider();
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Create or update user document
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            provider: 'facebook'
        }, { merge: true });
        
        hideLoading();
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'pages/chat.html';
        }, 1000);
        
        return { success: true, user: user };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Update Profile
async function updateUserProfile(displayName, photoURL) {
    try {
        const user = auth.currentUser;
        
        await user.updateProfile({
            displayName: displayName,
            photoURL: photoURL
        });
        
        await db.collection('users').doc(user.uid).update({
            displayName: displayName,
            photoURL: photoURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Profile updated!', 'success');
        return { success: true };
    } catch (error) {
        showNotification('Error updating profile', 'error');
        return { success: false, error: error.message };
    }
}

// Change Password
async function changePassword(currentPassword, newPassword) {
    try {
        showLoading('Changing password...');
        
        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        
        hideLoading();
        showNotification('Password changed successfully!', 'success');
        
        return { success: true };
    } catch (error) {
        hideLoading();
        const errorMessage = getAuthErrorMessage(error.code);
        showNotification(errorMessage, 'error');
        return { success: false, error: error.message };
    }
}

// Get Auth Error Message
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Check your connection',
        'auth/invalid-api-key': 'Invalid API configuration',
        'auth/app-deleted': 'App has been deleted',
        'auth/expired-action-code': 'Reset link has expired',
        'auth/invalid-action-code': 'Invalid reset link',
        'auth/user-token-expired': 'Session expired. Please login again'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again';
}

// Show Loading
function showLoading(message = 'Loading...') {
    const loader = document.getElementById('global-loader');
    const loaderText = document.getElementById('loader-text');
    
    if (loader) {
        loader.classList.remove('hidden');
        if (loaderText) loaderText.textContent = message;
    }
}

// Hide Loading
function hideLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.add('hidden');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// Check if User is Logged In
function requireAuth() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            if (user && user.emailVerified) {
                resolve(user);
            } else {
                window.location.href = 'login.html';
                reject(new Error('Not authenticated'));
            }
        });
    });
}

// Check if User is Guest (redirect if logged in)
function requireGuest() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            if (!user) {
                resolve();
            } else {
                window.location.href = 'chat.html';
                reject(new Error('Already logged in'));
            }
        });
    });
}

// Export functions globally
window.auth = auth;
window.db = db;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.resetPassword = resetPassword;
window.signOutUser = signOutUser;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword;
window.requireAuth = requireAuth;
window.requireGuest = requireGuest;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;
