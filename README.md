# SWIFT-code-API

docker build -t swift-code-api .

docker run --rm -p 8080:8080 swift-code-api

docker run --rm --name swift-test swift-code-api npm test
