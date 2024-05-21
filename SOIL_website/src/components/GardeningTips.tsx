import React, { useEffect, useState } from 'react';

type GardeningTips = {
    id: number;
    title: string;
    content: string;
};

const defaultGardeningTips = [
    {
        id: 1,
        title: 'Your complete organic gardening guide',
        content: 'Organic gardening is a labour of love that can yield amazing results for you and your family. The best thing is that you can get started whenever you want. Organic gardening gives you plenty to do year-round, no matter the season.',
    },
    {
        id: 2,
        title: 'How do you grow an organic garden?',
        content: 'Prevent the loss of topsoil from your garden\n' +
            'Remove toxic runoff, water pollution, and soil contamination\n' +
            'Support the lives of insects, birds, and other garden organisms\n' +
            'Save on organic supermarket food and inorganic garden materials\n' +
            'Grow healthier food for you and your family to enjoy\n' +
            'Cut down on organic waste by reconstituting it as compost\n' +
            'Put vacant space in your yard to practical use',
    },
   
];

function GardeningTipsComponent() {
    const [tips, setTips] = useState<GardeningTips[]>(defaultGardeningTips);

    useEffect(() => {
        // Remove only the gardeningTips data from localStorage 
        localStorage.removeItem('gardeningTips');
        localStorage.setItem('gardeningTips', JSON.stringify(defaultGardeningTips));
    }, []);

    return (
        <div className="container mx-auto mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <img
                    src="https://assets-global.website-files.com/5d2fb52b76aabef62647ed9a/6171ef46c5bb525d9b7c1ca6_organic-gardening-benefits-and-tips-hero.jpg"
                    alt="Gardening"
                    className="w-full object-cover h-48 md:h-full"
                />
            </div>
            <div className="flex flex-col justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Gardening Tips</h2>
                {tips.map((tip) => (
                    <div key={tip.id} className="mb-4">
                        <h3 className="text-xl font-semibold">{tip.title}</h3>
                        <p className="text-md">{tip.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GardeningTipsComponent;

