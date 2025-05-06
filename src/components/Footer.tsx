export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="px-4 sm:px-6 lg:px-8 w-full max-w-screen-xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Novel Translator. All rights reserved.
      </div>
    </footer>
  );
}
