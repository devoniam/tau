import { Bucket } from "../bucket";

export class MemberBucket extends Bucket {
    protected table = 'members';

    public currency: number = 0;
    public inventory: InventoryItem[] = [];
}

type InventoryItem = {
    item: string;
    amount: number;
}
