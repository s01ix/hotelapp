import React, { useState } from "react";
import { Search, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
	onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const { searchRooms, isLoading } = useApp();
	const { t } = useTranslation();

	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [guests, setGuests] = useState(1);

	const today = new Date().toISOString().split("T")[0];

	const handleSearch = async () => {
		if (!checkIn || !checkOut) {
			toast.error(t("searchBar.errors.datesRequired"));
			return;
		}

		if (checkIn < today) {
			toast.error(t("searchBar.errors.checkInPast"));
			return;
		}

		if (checkOut <= checkIn) {
			toast.error(t("searchBar.errors.checkOutBeforeCheckIn"));
			return;
		}

		if (guests < 1 || guests > 10) {
			toast.error(t("searchBar.errors.invalidGuests"));
			return;
		}

		await searchRooms(checkIn, checkOut, guests);
		if (onSearch) {
			onSearch();
		}
	};

	return (
		<div className="bg-card border border-border p-6 w-full shadow-sm">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4">
				<div className="space-y-2 flex flex-col">
					<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
						<Calendar className="h-4 w-4 text-primary" />
						{t("searchBar.checkIn")}
					</label>
					<Input
						type="date"
						value={checkIn}
						onChange={(e) => setCheckIn(e.target.value)}
						min={new Date().toISOString().split("T")[0]}
						className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
					/>
				</div>

				<div className="space-y-2 flex flex-col">
					<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
						<Calendar className="h-4 w-4 text-primary" />
						{t("searchBar.checkOut")}
					</label>
					<Input
						type="date"
						value={checkOut}
						onChange={(e) => setCheckOut(e.target.value)}
						min={checkIn || new Date().toISOString().split("T")[0]}
						className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
					/>
				</div>

				<div className="space-y-2 flex flex-col">
					<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
						<Users className="h-4 w-4 text-primary" />
						{t("searchBar.guests")}
					</label>
					<Input
						type="number"
						min="1"
						max="10"
						value={guests}
						onChange={(e) => setGuests(parseInt(e.target.value))}
						className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
					/>
				</div>

				{/* Search Button */}
				<div className="flex items-end">
					<Button
						onClick={handleSearch}
						disabled={isLoading}
						className="w-full bg-primary hover:bg-accent text-primary-foreground h-10 font-medium rounded-none transition-colors"
					>
						{isLoading ? (
							t("searchBar.searching")
						) : (
							<>
								<Search className="h-4 w-4 mr-2" />
								{t("searchBar.search")}
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
