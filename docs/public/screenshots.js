/* Enlarge local documentation screenshots without changing their source dimensions. */
function setupScreenshots() {
  const screenshots = [...document.querySelectorAll('.sl-markdown-content img')];
  if (!screenshots.length || document.querySelector('#screenshot-dialog')) return;

  const dialog = document.createElement('dialog');
  dialog.id = 'screenshot-dialog';
  dialog.className = 'screenshot-dialog';
  dialog.setAttribute('aria-label', '产品截图预览');
  const toolbar = document.createElement('div');
  toolbar.className = 'screenshot-toolbar';
  const title = document.createElement('span');
  title.id = 'screenshot-title';
  dialog.setAttribute('aria-labelledby', title.id);
  const sizeButton = document.createElement('button');
  sizeButton.type = 'button';
  sizeButton.textContent = '原始尺寸';
  sizeButton.setAttribute('aria-pressed', 'false');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = '关闭';
  const stage = document.createElement('div');
  stage.className = 'screenshot-stage';
  const image = document.createElement('img');
  stage.append(image);
  toolbar.append(title, sizeButton, closeButton);
  dialog.append(toolbar, stage);
  document.body.append(dialog);
  let opener;
  let previousOverflow;

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
  sizeButton.addEventListener('click', () => {
    const original = dialog.classList.toggle('original-size');
    sizeButton.setAttribute('aria-pressed', String(original));
    sizeButton.textContent = original ? '适应窗口' : '原始尺寸';
  });

  screenshots.forEach((screenshot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'screenshot-open';
    const width = Number(screenshot.getAttribute('width'));
    if (width > 0) button.style.maxWidth = `${width}px`;
    button.setAttribute('aria-label', `放大截图：${screenshot.alt}`);
    screenshot.before(button);
    button.append(screenshot);
    button.addEventListener('click', () => {
      opener = button;
      image.src = screenshot.currentSrc || screenshot.src;
      image.alt = screenshot.alt;
      title.textContent = screenshot.alt || '产品截图';
      dialog.classList.remove('original-size');
      sizeButton.textContent = '原始尺寸';
      sizeButton.setAttribute('aria-pressed', 'false');
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      closeButton.focus();
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupScreenshots);
else setupScreenshots();
document.addEventListener('astro:page-load', setupScreenshots);
