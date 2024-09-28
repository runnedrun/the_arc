# USE TEST
export SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
firebase use test
cp ./private_configs/test-config.env .env.development
cp ./private_configs/test-config.env .env.production
# cp ./private_configs/staging-functions-env.env ./.env
export GOOGLE_APPLICATION_CREDENTIALS="$SRC_DIR/private_configs/test-google-app-credentials.json"
export GCLOUD_PROJECT="yaya-test-5d958"
export PROJECT_NAME="yaya-test-5d958"
unset NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST
unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_DATABASE_EMULATOR_HOST