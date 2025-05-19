export default interface Menu {
    title: string;
    url?: string;
    isOpen?: boolean;
    icon: string;
    emoji: string;
    subMenu?: Menu[];
}