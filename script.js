document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionControls = document.getElementById('compressionControls');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processImage(file);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    });

    // 处理图片压缩
    function processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                // 显示原始图片
                originalPreview.src = originalImage.src;
                originalSize.textContent = formatFileSize(file.size);
                
                // 显示控制和预览区域
                compressionControls.style.display = 'block';
                previewArea.style.display = 'block';
                
                // 压缩图片
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片函数
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        // 绘制图片
        ctx.drawImage(originalImage, 0, 0);
        
        // 压缩
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 