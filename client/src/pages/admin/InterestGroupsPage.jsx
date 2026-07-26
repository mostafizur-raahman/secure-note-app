import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import userService from "../../services/userService";
import { extractList } from "../../utils/extractData";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Btn from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";

export default function InterestGroupsPage() {
    const toast = useToast();

    const [groups, setGroups] = useState([]);
    const [allInterests, setAllInterests] = useState([]);
    const [selectedInterest, setSelectedInterest] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userService
            .groupedByInterest()
            .then((response) => {
                const list = extractList(response);
                setGroups(list);
                // Extract interest names for filter dropdown
                const names = list
                    .map((g) => g._id || g.interest)
                    .filter(Boolean);
                setAllInterests(names);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
            });
    }, []);

    // Filter groups based on selected interest
    const filteredGroups =
        selectedInterest === "all"
            ? groups
            : groups.filter((g) => (g._id || g.interest) === selectedInterest);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Users Grouped by Interests <Badge variant="admin">Admin</Badge>
            </h2>
            <p className="text-xs text-[#a3a3a3] mb-4">
                MongoDB Aggregation — single collection.aggregate() call
                grouping users by each interest
            </p>

            {/* Filter bar */}
            <div className="flex items-center gap-3 mb-6">
                <label className="text-xs font-medium text-[#a3a3a3]">
                    Filter by interest:
                </label>
                <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-[#e5e5e5] text-sm cursor-pointer">
                    <option value="all">All Interests</option>
                    {allInterests.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                {selectedInterest !== "all" && (
                    <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedInterest("all")}>
                        Clear filter
                    </Btn>
                )}
                <span className="text-xs text-[#525252]">
                    Showing {filteredGroups.length} of {groups.length} groups
                </span>
            </div>

            {loading ? (
                <Spinner />
            ) : filteredGroups.length === 0 ? (
                <Empty message="No interest groups found" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((g, i) => {
                        const interestName = g._id || g.interest || "Unknown";
                        const userList = g.users || [];
                        const count = g.count || userList.length || 0;
                        return (
                            <Card key={interestName + "-" + i}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="orange">
                                        {interestName}
                                    </Badge>
                                    <span className="text-xs text-[#a3a3a3]">
                                        {count} users
                                    </span>
                                </div>
                                {userList.length > 0 ? (
                                    <div className="space-y-1">
                                        {userList.map((u, j) => (
                                            <div
                                                key={u.id || u.email || j}
                                                className="text-sm text-[#e5e5e5] flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] anim-pulseDot"></span>
                                                <span className="font-medium">
                                                    {u.name || "Unknown"}
                                                </span>
                                                <span className="text-[#525252]">
                                                    ({u.email})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-[#525252]">
                                        No users listed
                                    </p>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
