// Certificate Modal Functionality
let certModal = null;
let currentCertSrc = '';
let currentCertFilename = '';

function openCertModal(src) {
  currentCertSrc = src;
  
  // Extract filename from src
  currentCertFilename = src.split('/').pop();
  
  // Create modal if it doesn't exist
  if (!certModal) {
    certModal = document.createElement('div');
    certModal.className = 'cert-modal';
    certModal.innerHTML = `
      <div class="cert-modal-content">
        <button class="cert-modal-close" onclick="closeCertModal()">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img id="certModalImg" src="" alt="Certificate">
        <a id="certModalDownload" class="cert-modal-download" href="" download="">
          <i class="fa-solid fa-download"></i> Download Certificate
        </a>
      </div>
    `;
    
    // Close modal when clicking outside
    certModal.addEventListener('click', function(e) {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
    
    document.body.appendChild(certModal);
  }
  
  // Set image and download link
  document.getElementById('certModalImg').src = currentCertSrc;
  document.getElementById('certModalDownload').href = currentCertSrc;
  document.getElementById('certModalDownload').download = currentCertFilename;
  
  // Show modal
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  if (certModal) {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
    closeCertModal();
  }
});
