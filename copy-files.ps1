# Copy diem files
Copy-Item -Path "diem/*.json" -Destination "src/diem/" -Force

# Copy mg files
Copy-Item -Path "mg/*.json" -Destination "src/mg/" -Force 