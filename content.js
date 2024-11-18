let hoverTimer; // Timer to track the hover duration

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
            closeButton.style.zIndex = '1001';

            closeButton.addEventListener('click', () => {
                container.remove(); // Remove iframe on button click
            });

            // Create the iframe
            const iframe = document.createElement('iframe');
            iframe.src = target.href;
            iframe.style.flex = '1'; // Allow iframe to occupy the remaining space
            iframe.style.border = 'none';
            iframe.style.overflow = 'auto'; // Make iframe scrollable if content is large

            // Add resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.style.width = '10px';
            resizeHandle.style.height = '10px';
            resizeHandle.style.background = '#ccc';
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.right = '0';
            resizeHandle.style.cursor = 'se-resize';

            // Drag functionality
            let isDragging = false;
            let offsetX, offsetY;

            container.addEventListener('mousedown', (e) => {
                if (e.target !== resizeHandle) {
                    isDragging = true;
                    offsetX = e.clientX - container.offsetLeft;
                    offsetY = e.clientY - container.offsetTop;
                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('mouseup', stopDrag);
                }
            });

            function onDrag(e) {
                if (isDragging) {
                    container.style.left = `${e.clientX - offsetX}px`;
                    container.style.top = `${e.clientY - offsetY}px`;
                }
            }

            function stopDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
            }

            // Resize functionality
            let isResizing = false;

            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isResizing = true;
                document.addEventListener('mousemove', onResize);
                document.addEventListener('mouseup', stopResize);
            });

            function onResize(e) {
                if (isResizing) {
                    const newWidth = e.clientX - container.offsetLeft;
                    const newHeight = e.clientY - container.offsetTop;
                    container.style.width = `${Math.max(newWidth, 200)}px`; // Minimum width
                    container.style.height = `${Math.max(newHeight, 200)}px`; // Minimum height
                }
            }

            function stopResize() {
                isResizing = false;
                document.removeEventListener('mousemove', onResize);
                document.removeEventListener('mouseup', stopResize);
            }

            // Append elements
            container.appendChild(closeButton);
            container.appendChild(iframe);
            container.appendChild(resizeHandle);

            // Get the link's position and dimensions
            const rect = target.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Position beside the link, centered vertically
            let top = rect.top + window.scrollY + rect.height / 2 - 300; // Center vertically
            let left = rect.right + window.scrollX + 10; // Position to the right of the link, leaving a 10px gap

            // Adjust position if it goes outside the viewport
            if (left + 800 > viewportWidth) {
                left = rect.left + window.scrollX - 800 - 10; // Move to the left of the link if it overflows
            }
            if (top < window.scrollY) {
                top = window.scrollY + 10; // Ensure a small margin if too close to the top
            }

            // Apply the calculated position
            container.style.top = `${top}px`;
            container.style.left = `${left}px`;

            document.body.appendChild(container);
        }, 2000); // 2-second delay
    }
});

document.addEventListener('mouseout', (event) => {
    const target = event.target.closest('a'); // Detect when the cursor leaves the link
    if (target) {
        clearTimeout(hoverTimer); // Cancel the timer if the user moves away before 2 seconds
    }
});
