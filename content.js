document.addEventListener('mouseover', (event) => {
    const target = event.target.closest('a'); // Detect the hovered link
    if (target) {
        hoverTimer = setTimeout(() => {
            // Create the container for the iframe
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.width = '800px';
            container.style.height = '600px';
            container.style.border = '1px solid #ccc';
            container.style.borderRadius = '8px';
            container.style.backgroundColor = '#fff';
            container.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.2)';
            container.style.zIndex = '1000';
            container.style.overflow = 'hidden';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.cursor = 'grab';

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerText = '✖';
            closeButton.style.alignSelf = 'flex-end';
            closeButton.style.background = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.color = '#333';
            closeButton.style.fontSize = '18px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.margin = '5px';

            closeButton.addEventListener('click', () => {
                container.remove(); // Remove the container on close button click
            });

            // Create the iframe
            const iframe = document.createElement('iframe');
            iframe.src = target.href;
            iframe.style.flex = '1'; // Allow iframe to occupy the remaining space
            iframe.style.border = 'none';

            // Append elements
            container.appendChild(closeButton);
            container.appendChild(iframe);

            // Position the container near the link
            const rect = target.getBoundingClientRect();
            container.style.top = `${rect.top + window.scrollY + rect.height / 2 - 300}px`;
            container.style.left = `${rect.right + window.scrollX + 10}px`;

            // Add to the document
            document.body.appendChild(container);

            // Drag-and-drop functionality
            let isDragging = false;
            let offsetX = 0, offsetY = 0;

            container.addEventListener('mousedown', (e) => {
                if (e.target !== container) return;
                isDragging = true;
                offsetX = e.clientX - container.offsetLeft;
                offsetY = e.clientY - container.offsetTop;
                container.style.cursor = 'grabbing';

                // Disable pointer events for the iframe
                iframe.style.pointerEvents = 'none';

                // Listen for mousemove and mouseup globally
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            const onMouseMove = (e) => {
                if (isDragging) {
                    e.preventDefault(); // Prevent text selection or other unwanted behaviors
                    container.style.left = `${e.clientX - offsetX}px`;
                    container.style.top = `${e.clientY - offsetY}px`;
                }
            };

            const onMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    container.style.cursor = 'grab';
                    iframe.style.pointerEvents = 'auto'; // Re-enable iframe interactions

                    // Remove global listeners to avoid memory leaks
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
            };

            // Resizing functionality
            const resizeHandle = document.createElement('div');
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.width = '15px';
            resizeHandle.style.height = '15px';
            resizeHandle.style.backgroundColor = '#ccc';
            resizeHandle.style.borderRadius = '50%';
            resizeHandle.style.cursor = 'nwse-resize';
            resizeHandle.style.bottom = '5px';
            resizeHandle.style.right = '5px';

            container.appendChild(resizeHandle);

            let isResizing = false;
            let startWidth = 0, startHeight = 0, startX = 0, startY = 0;

            resizeHandle.addEventListener('mousedown', (e) => {
                isResizing = true;
                startWidth = container.offsetWidth;
                startHeight = container.offsetHeight;
                startX = e.clientX;
                startY = e.clientY;

                // Listen for mousemove and mouseup globally
                document.addEventListener('mousemove', onResizeMove);
                document.addEventListener('mouseup', onResizeUp);

                // Prevent default actions
                e.preventDefault();
                e.stopPropagation();
            });

            const onResizeMove = (e) => {
                if (isResizing) {
                    const newWidth = startWidth + (e.clientX - startX);
                    const newHeight = startHeight + (e.clientY - startY);
                    container.style.width = `${newWidth}px`;
                    container.style.height = `${newHeight}px`;
                }
            };

            const onResizeUp = () => {
                if (isResizing) {
                    isResizing = false;

                    // Remove global listeners to avoid memory leaks
                    document.removeEventListener('mousemove', onResizeMove);
                    document.removeEventListener('mouseup', onResizeUp);
                }
            };
        }, 2000); // 2-second delay
    }
});

document.addEventListener('mouseout', (event) => {
    const target = event.target.closest('a'); // Detect when the cursor leaves the link
    if (target) {
        clearTimeout(hoverTimer); // Cancel the timer if the user moves away before 2 seconds
    }
});
