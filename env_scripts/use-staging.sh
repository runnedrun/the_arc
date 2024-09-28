export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use default
cp ./private_configs/staging-config.env .env.development
cp ./private_configs/staging-config.env .env.production
# cp ./private_configs/staging-functions-env.env ./.env
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/staging-google-app-credentials.json"
export GCLOUD_PROJECT="thearc-10416"
export PROJECT_NAME="xqchinese-325dd"
unset NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_DATABASE_EMULATOR_HOST