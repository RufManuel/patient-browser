docker build --label "patient-browser:latest" --tag "patient-browser" .
docker run -d --network hapifhirfnc_default -p 8081:80 --name patient-browser patient-browser
