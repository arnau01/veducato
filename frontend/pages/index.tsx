import { MistralCodeGenerator } from '../components/MistralCodeGenerator';
import { BackgroundBeams } from '../components/ui/background-beams';

export default function Home() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-6xl px-4">
			<BackgroundBeams />
				<MistralCodeGenerator />
			</div>
		</div>
	);
}