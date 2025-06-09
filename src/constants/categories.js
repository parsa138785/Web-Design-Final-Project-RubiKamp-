export const CategoryIds = {
    LAPTOP: 'laptop',
    MOBILE: 'mobile',
    CAMERA: 'camera',
    FOOD: 'food'
};

export const CategoryLabels = {
    [CategoryIds.LAPTOP]: 'لپ تاپ',
    [CategoryIds.MOBILE]: 'موبایل',
    [CategoryIds.CAMERA]: 'دوربین',
    [CategoryIds.FOOD]: 'غذا'
};

export const CATEGORIES = Object.entries(CategoryIds).map(([key, id]) => ({
    id,
    label: CategoryLabels[id]
}));

const PRODUCTS = [
    {
        id: 1,
        name: 'مک بوک پرو',
        price: 1500,
        category: CategoryIds.LAPTOP
    },
    {
        id: 2,
        name: 'مک بوک پرو دو',
        price: 800,
        category: CategoryIds.LAPTOP
    },
    {
        id: 3,
        name: 'مک بوک ایر',
        price: 2000,
        category: CategoryIds.LAPTOP
    },
    {
        id: 4,
        name: 'موبایل ایفون شش',
        price: 900,
        category: CategoryIds.MOBILE
    },
    {
        id: 5,
        name: 'موبایل ایفون پونزده پرو',
        price: 2500,
        category: CategoryIds.MOBILE
    },
    {
        id: 6,
        name: 'موبایل شیائومی',
        price: 1000,
        category: CategoryIds.MOBILE
    },
    {
        id: 7,
        name: 'لپ تاپ ایسوس',
        price: 3000,
        category: CategoryIds.LAPTOP
    },
    {
        id: 8,
        name: 'لپ تاپ خیلی گرون',
        price: 3000,
        category: CategoryIds.LAPTOP
    },
    {
        id: 9,
        name: 'موبایل سامسونگ',
        price: 3000,
        category: CategoryIds.MOBILE
    },
    {
        id: 10,
        name: 'دوربین کانون',
        price: 1200,
        category: CategoryIds.CAMERA
    },
    {
        id: 11,
        name: 'دوربین فوجی',
        price: 1300,
        category: CategoryIds.CAMERA
    }
];

export { PRODUCTS };
export default CATEGORIES;
