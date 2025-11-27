document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const phoneNumber = document.getElementById('phoneNumber').textContent;
  const copyMsg = document.getElementById('copyMsg');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      copyMsg.classList.add('visible');
      setTimeout(() => copyMsg.classList.remove('visible'), 2500);
    } catch (err) {
      alert('Failed to copy! Please copy manually.');
    }
  });
});
