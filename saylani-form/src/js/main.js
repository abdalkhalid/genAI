document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    // Add validation feedback classes to all form inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
    });

    // File upload handling
    const fileInput = form.querySelector('input[type="file"]');
    const uploadButton = form.querySelector('.ant-upload');
    
    uploadButton.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload only JPG, JPEG or PNG files');
                this.value = '';
                return;
            }
            
            // Validate file size (1MB = 1048576 bytes)
            if (file.size > 1048576) {
                alert('File size must be less than 1MB');
                this.value = '';
                return;
            }

            // Show preview
            const preview = document.createElement('img');
            preview.style.width = '100px';
            preview.style.height = '100px';
            preview.style.objectFit = 'cover';
            
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            const uploadSpan = uploadButton.querySelector('span');
            uploadSpan.innerHTML = '';
            uploadSpan.appendChild(preview);
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset validation state
        form.classList.remove('was-validated');
        
        // Get form values
        const formData = {
            country: form.country.value,
            city: form.city.value,
            course: form.course.value,
            fullName: form.fullName.value,
            fatherName: form.fatherName.value,
            email: form.email.value,
            phone: form.phone.value,
            cnic: form.cnic.value,
            fatherCnic: form.fatherCnic.value,
            dob: form.dob.value,
            address: form.address.value,
            qualification: form.qualification.value
        };

        // Custom validation
        let isValid = true;
        
        // Validate CNIC format
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        if (!cnicRegex.test(formData.cnic)) {
            form.cnic.classList.add('is-invalid');
            isValid = false;
        }

        // Validate phone number (Pakistani format)
        const phoneRegex = /^(\+92|0)?3\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            form.phone.classList.add('is-invalid');
            isValid = false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            form.email.classList.add('is-invalid');
            isValid = false;
        }

        // Check required fields
        for (let key in formData) {
            const input = form[key];
            if (input && input.required && !formData[key]) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }

        // Add validation class to form
        form.classList.add('was-validated');

        if (isValid) {
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success mt-3';
            successAlert.textContent = 'Form submitted successfully! We will contact you soon.';
            form.appendChild(successAlert);

            // Remove success message after 3 seconds
            setTimeout(() => {
                successAlert.remove();
                form.reset();
                form.classList.remove('was-validated');
                // Reset all validation states
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
                // Reset file upload preview
                const uploadSpan = uploadButton.querySelector('span');
                uploadSpan.innerHTML = '+ Upload';
            }, 3000);
        }
    });
});