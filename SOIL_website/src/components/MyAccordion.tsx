import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'

interface Meal {
    name: string;
    Ingredients: string[];
}

interface DailyMeals {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}

export type { DailyMeals, Meal };

// form for daily meals
export default function MyAccordion({ dailyMeals }: { dailyMeals: DailyMeals }) {
    return (
        <div className='w-full'>·
            <Accordion allowMultiple>
                    <AccordionItem >
                        <h2>
                            <AccordionButton >
                                <Box as="span" flex='1' textAlign='left'>
                                    {dailyMeals.breakfast.name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel >
                            <ul>
                                {dailyMeals.breakfast.Ingredients.map((ingredient, index) =>
                                    <li key={index}>{ingredient}</li>
                                )}
                            </ul>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem >
                        <h2>
                            <AccordionButton >
                                <Box as="span" flex='1' textAlign='left'>
                                    {dailyMeals.lunch.name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel >
                            <ul>
                                {dailyMeals.lunch.Ingredients.map((ingredient, index) =>
                                    <li key={index}>{ingredient}</li>
                                )}
                            </ul>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem >
                        <h2>
                            <AccordionButton >
                                <Box as="span" flex='1' textAlign='left'>
                                    {dailyMeals.dinner.name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel >
                            <ul>
                                {dailyMeals.dinner.Ingredients.map((ingredient, index) =>
                                    <li key={index}>{ingredient}</li>
                                )}
                            </ul>
                        </AccordionPanel>
                    </AccordionItem>

            </Accordion>
        </div>
    )
}
