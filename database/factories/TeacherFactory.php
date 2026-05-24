<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User; 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
    return [
        'tenant_id' => 1,
        'first_name' => fake()->firstName(),
        'last_name' => fake()->lastName(),
        'subject' => 'Development',
        'user_id' => User::factory(),
    ];
    }
}
