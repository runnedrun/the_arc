export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use prod
cp ./private_configs/prod-config.env .env.development
cp ./private_configs/prod-config.env .env.production
# cp ./private_configs/prod-functions-env.env ./.env
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/prod-google-app-credentials.json"
export GCLOUD_PROJECT="yomuya-prod"
export PROJECT_NAME="yomuya-prod"
unset NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_DATABASE_EMULATOR_HOST