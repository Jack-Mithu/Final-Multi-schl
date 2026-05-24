<?php

namespace App\Actions\Fortify;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // Validate input first
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'school_name' => ['required', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
        ])->validate();

        try {
            DB::beginTransaction();

            // Create the user first
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
            ]);

            // Assign admin role
            $user->assignRole('admin');

            // Create tenant record
            $tenant = Tenant::create([
                'school_name' => $input['school_name'],
                'address' => $input['address'] ?? null,
            ]);

            // Set tenant_id to the created tenant's ID
            $user->tenant_id = $tenant->tenant_id;
            $user->save();

            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
