"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
exports.metadata = {
    title: 'Keitaro Tracker',
    description: 'Keitaro Ad-Tracker - TypeScript Translation',
};
function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>);
}
//# sourceMappingURL=layout.js.map