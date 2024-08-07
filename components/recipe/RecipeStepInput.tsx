import { useState } from 'react';

interface RecipeStep {
    description: string;
    image: string | null;
}

const RecipeStepInput: React.FC = () => {
    const [steps, setSteps] = useState<RecipeStep[]>([
        { description: '', image: null },
    ]);

    const handleDescriptionChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], description: value };
        setSteps(newSteps);
    };

    const handleImageChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const newSteps = [...steps];
                    newSteps[index] = {
                        ...newSteps[index],
                        image: e.target.result as string,
                    };
                    setSteps(newSteps);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleAddStep = () => {
        setSteps([...steps, { description: '', image: null }]);
    };

    const handleRemoveStep = (index: number) => {
        if (steps.length > 1) {
            const newSteps = steps.filter((_, i) => i !== index);
            setSteps(newSteps);
        }
    };

    return (
        <div className='p-4 flex flex-col items-center'>
            <div className='space-y-4 w-full max-w-4xl'>
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className='flex items-start space-x-4'
                    >
                        <div className='w-1/12 flex-shrink-0 text-lg font-semibold'>
                            Step {index + 1}
                        </div>
                        <textarea
                            value={step.description}
                            onChange={(e) =>
                                handleDescriptionChange(index, e.target.value)
                            }
                            placeholder='Enter description...'
                            className='border border-gray-300 rounded p-2 w-3/5 h-52 resize-none text-base'
                            style={{ fontSize: '16px' }}
                        />
                        <div className='relative w-52 h-52 border border-gray-300 rounded overflow-hidden'>
                            <img
                                src={step.image || '/placeholder.png'}
                                alt={`Step ${index + 1} preview`}
                                className='object-cover w-full h-full'
                            />
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => handleImageChange(index, e)}
                                className='absolute inset-0 opacity-0 cursor-pointer'
                            />
                        </div>
                        {steps.length > 1 && (
                            <button
                                onClick={() => handleRemoveStep(index)}
                                className='text-red-500 hover:underline'
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={handleAddStep}
                    className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4'
                >
                    + Add Step
                </button>
            </div>
        </div>
    );
};

export default RecipeStepInput;
