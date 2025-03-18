export default function Header() {
	return (
		<div className="flex flex-col items-center p-6">
			<h1 className="text-4xl font-bold text-gray-900 drop-shadow-md">Plagiarism Checker</h1>
			<p className="mt-4 max-w-2xl text-center text-lg bg-slate-100 text-gray-700 p-6 rounded-xl shadow-lg">
				Our Plagiarism Checker helps users identify copied content by analyzing text against online sources. Simply
				upload a document or enter text, and our system will scan the web for similarities. The results will highlight
				matching phrases, similarity percentages, and source links, ensuring originality and accuracy.
			</p>
		</div>
	);
}
