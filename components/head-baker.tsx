import { useQuery } from '@tanstack/react-query';
import { usePool } from '@/providers/PoolProvider';
import { Countdown } from './countdown';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import axios from "axios";


const HeadBaker = () => {
    const { currentAuction, config } = usePool();
    console.log(currentAuction)
    const { data: currentFeeRecipient } = useQuery({
        queryKey: ['currentFeeRecipient', config?.feeRecipient],
        enabled: !!config?.feeRecipient,
        queryFn: async () => {
            // Replace with actual API call
            const { data: { user } } = await axios.get(`/api/neynar/user?address=${config?.feeRecipient}`);
            return {
                avatar: user.pfpUrl,
                name: user.displayName,
                handle: user.username,
            };
        },
        staleTime: 60000, // 1 minute
    });
    return (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7 ring-2 ring-white/40">
                    <AvatarImage src={currentFeeRecipient?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs bg-white/20 text-white">
                        {currentFeeRecipient?.name[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{currentFeeRecipient?.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/25 text-white/90 text-[10px] font-bold uppercase tracking-wider">
                        Head Baker
                    </span>
                </div>
            </div>
            <Countdown endTime={Number(currentAuction?.endTime || 0) * 1000} className="text-white/80 text-xs font-medium whitespace-nowrap" />
        </div>
    );
}

export default HeadBaker;