// // Function to dynamically create a widget element
// function createWidgetElement(title, textContent) {
//   const div = document.createElement('div');
//   div.className = 'widget-content';

//   const h3 = document.createElement('h3');
//   h3.textContent = title;
//   div.appendChild(h3);

//   const p = document.createElement('p');
//   p.textContent = textContent;
//   div.appendChild(p);

//   const button = document.createElement('button');
//   button.className = 'remove-btn';
//   button.setAttribute('aria-label', 'Remove widget');
//   button.setAttribute('title', 'Remove widget');
//   button.textContent = 'x';
//   div.appendChild(button);

//   return div;
// }

// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Widgets Script has been called.");

//   // Initialize GridStack with configuration
//   const grid = GridStack.init({
//     column: 12, // Grid width (12 columns is flexible)
//     float: true, // Widgets can overlap or float
//     removable: false, // Prevents accidental deletion
//   });

//   // Example widgets
//   grid.addWidget({
//     x: 0,
//     y: 0,
//     w: 4,
//     h: 2,
//     content: createWidgetElement('Chart', 'This is a text widget').outerHTML
//   });

//   grid.addWidget({
//     x: 4,
//     y: 0,
//     w: 4,
//     h: 2,
//     content: createWidgetElement('News', 'Latest news updates will go here.').outerHTML
//   });

//   grid.addWidget({
//     x: 8,
//     y: 0,
//     w: 4,
//     h: 2,
//     content: createWidgetElement('Test', 'This widget is for testing purposes.').outerHTML
//   });

//   // Handle widget removal via 'x' button
//   document.querySelector('.grid-stack').addEventListener('click', (e) => {
//     if (e.target.classList.contains('remove-btn')) {
//       const widgetEl = e.target.closest('.grid-stack-item');
//       if (widgetEl) {
//         grid.removeWidget(widgetEl);
//       }
//     }
//   });

//   // Save widget positions when moved (optional persistence)
//   grid.on('dragstop', (event, element) => {
//     const widgets = grid.save();
//     console.log('Widget positions:', widgets); // Could send this to the server
//   });

//   // Search Bar Functionality
//   const searchBar = document.querySelector('.search-bar');
//   if (searchBar) {
//     searchBar.addEventListener('keypress', (e) => {
//       if (e.key === 'Enter') {
//         const company = searchBar.value.trim();
//         if (company) {
//           console.log(`Searching for: ${company}`);
//           // TODO: Add logic to fetch and display company data
//         }
//       }
//     });
//   }

//   // Add View Button Functionality
//   const addViewBtn = document.querySelector('.add-view-btn');
//   if (addViewBtn) {
//     addViewBtn.addEventListener('click', () => {
//       grid.addWidget({
//         w: 4,
//         h: 2,
//         content: createWidgetElement('New Widget', 'This is a new widget.').outerHTML
//       });
//     });
//   }

//   // Chat Button Functionality
//   const chatBtn = document.querySelector('.chat-btn');
//   if (chatBtn) {
//     chatBtn.addEventListener('click', () => {
//       console.log('Opening chatbot...');
//       // TODO: Replace with actual chatbot function from teammates
//       // e.g., openChatbot();
//     });
//   }
// });
