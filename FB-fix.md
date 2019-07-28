# Facebook login fix

### Init Prettier
* Pull the projet source
* Checkout branch `git checkout feat/prettier-config`
* Install prettier, run 
```
npm install
```

### Ionic Native Facebook
* First of all, you should remove `cordova-plugin-facebook4`
```
ionic cordova plugin rm cordova-plugin-facebook4
```

* Re-install it with the following `API_ID` and `APP_NAME` variables
```
cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="505378480268670" --variable APP_NAME="Listoo"
```

* Genere a key hash for Facebook's application
```
cd /MyListooIonicApp
```
```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

* Tap the password, generally _Cordova_ uses `android` as password
```
Entrez le mot de passe du fichier de clés :  android
```
* Copy the key hash [**EEh/ODxycjgIgvgFOy6VBezPQw4=**] and give it to the `Maintainer`
```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
Entrez le mot de passe du fichier de clés :  android
EEh/ODxycjgIgvgFOy6VBezPQw4=
```

* Deploy to stores
