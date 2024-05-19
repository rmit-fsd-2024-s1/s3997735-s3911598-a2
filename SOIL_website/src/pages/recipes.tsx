import { Button, Select } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
} from '@chakra-ui/react'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
} from '@chakra-ui/react'
import LoadingButton from '@mui/lab/LoadingButton';
import MyAccordion from '../components/MyAccordion';
import { Meal, DailyMeals } from '../components/MyAccordion';
import { stringify } from 'querystring';
import { useState } from 'react';







const activityLevel = [{ value: 'sedentary', label: 'Sedentary' }, { value: 'moderate', label: 'Moderate' }, { value: 'active', label: 'Active' }, { value: 'very active', label: 'Very Active' }];

const genderOptions = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
const dietaryPreference = [{ value: 'vegan', label: 'Vegan' }, { value: 'vegetarian', label: 'Vegetarian' }, { value: 'pescatarian', label: 'Pescatarian' }, { value: 'omnivore', label: 'Omnivore' }];
const healthGoal = [{ value: 'lose weight', label: 'Lose Weight' }, { value: 'maintain weight', label: 'Maintain Weight' }, { value: 'gain weight', label: 'Gain Weight' }];


export default function Recipes() {
    const [isloading, setIsLoading] = useState(false);
    const [dailyMeals, setDailyMeals] = useState<DailyMeals | null>(null);
    const toast = useToast();
    const [age, setAge] = useState("22");
    const [weight, setWeight] = useState("60");
    const [height, setHeight] = useState("170");
    const [gender, setGender] = useState("male");
    const [activity, setActivity] = useState("sedentary");
    const [dietary, setDietary] = useState("omnivore");
    const [health, setHealth] = useState("lose weight");


    const generateHandler = async () => {
        setIsLoading(true);
        // construct the content of the api request
        const content =  'my profile is as follow:\nage(years):'+age+';\nweight(kg):'+weight+';\nheight(cm):'+height+'\nGender:'+gender+'\nActivity Level:'+activity+'\nDietary Preference:'+ dietary+'\nHealth Goal:'+health+'\ngive me daily recipes with my profile.\n\nmust with the json form of follow:\n{\n  \"breakfast\": {\n    \"name\": \"\",\n    \"Ingredients\": []\n  },\n  \"lunch\": {\n    \"name\": \"\",\n    \"Ingredients\": []\n  },\n  \"dinner\": {\n    \"name\": \"\",\n    \"Ingredients\": []\n  }\n}\n';

        await fetch("https://gtapi.xiaoerchaoren.com:8932/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer sk-8wtpszljgx7WmvBI61AfE47704054a96Ae109e1a9e403c2b"
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                // the temperature is set to 0.0 to get the fixed form from OpenAI
                "temperature": 0.0,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a restful api style assistant."
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ]


            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            //  the fixed form from OpenAI 
            var content = data.choices[0].message.content;
            // we ask the assistant to give us the daily recipes with json form
            //so we need to extract the daily recipes from the response by cutting off the string
            var startIndex = content.indexOf('{');
            var endIndex = content.lastIndexOf('}');
            var resultString = content.substring(startIndex, endIndex + 1);

            var resultObject = JSON.parse(resultString);
            // transform the result to the DailyMeals type
            const result: DailyMeals = {
                breakfast: resultObject.breakfast,
                lunch: resultObject.lunch,
                dinner: resultObject.dinner,
            };
            console.log(JSON.stringify(result, null, 2));
            setIsLoading(false);
            setDailyMeals(result);
            toast({
                title: 'Success!',
                status: 'success',
                duration: 2500,
            });
        }).catch(error => {
            console.error('Exception:', error.toString());
            toast({
                title: 'Something went wrong!',
                status: 'error',
                duration: 2500,
            });
        });

    }

    return (
        <div className='flex w-full'>
            <div className=' w-1/2'>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>age(years):</FormLabel>
                    <>
                        <NumberInput className='form-input' value= {age} onChange={(valueAsString, valueAsNumber) => setAge(valueAsString)}  min={0} max={100}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>weight(kg):</FormLabel>
                    <>
                        <NumberInput className='form-input' value= {weight} onChange={(valueAsString, valueAsNumber) => setWeight(valueAsString)} min={0} max={200}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>height(cm):</FormLabel>
                    <>
                        <NumberInput className='form-input' value= {height} onChange={(valueAsString, valueAsNumber) => setHeight(valueAsString)}  min={140} max={300}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>Gender</FormLabel>
                    <Select className='form-input' value= {gender} onChange={(e) => setGender(e.target.value)}  >
                        {genderOptions.map((activity, index) => {
                            return <option key={index} value={activity.value}>{activity.label}</option>
                        })}
                    </Select>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>Activity Level</FormLabel>
                    <Select className='form-input' value= {activity} onChange={(e) => setActivity(e.target.value)}>
                        {activityLevel.map((activity, index) => {
                            return <option key={index} value={activity.value}>{activity.label}</option>
                        })}
                    </Select>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>Dietary Preference</FormLabel>
                    <Select className='form-input' value= {dietary} onChange={(e) => setDietary(e.target.value)}>
                        {dietaryPreference.map((activity, index) => {
                            return <option key={index} value={activity.value}>{activity.label}</option>
                        })}
                    </Select>
                </FormControl>
                <FormControl className='form-control'>
                    <FormLabel className='form-label'>Health Goal</FormLabel>
                    <Select className='form-input' value= {health} onChange={(e) => setHealth(e.target.value)} >
                        {healthGoal.map((activity, index) => {
                            return <option key={index} value={activity.value}>{activity.label}</option>
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className='flex flex-col w-1/2 p-3 items-center justify-center gap-6'>
                <LoadingButton loading={isloading} onClick={generateHandler} variant="outlined">
                    Calculate
                </LoadingButton>
                {dailyMeals && <MyAccordion dailyMeals={dailyMeals} />}
            </div>
        </div>
    );

}
