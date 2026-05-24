<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\RedirectResponse;

trait Toastable
{
    /**
     * Generate a redirect response with a toast flash message.
     *
     * @param string $type    The toast type (e.g., 'success', 'error')
     * @param string $message The message to display
     * @param string $route   The named route to redirect to
     * @return RedirectResponse
     */
    protected function toastRedirect(string $type, string $message, string $route): RedirectResponse
    {
        return redirect()->route($route)->with('toast', [
            'type' => $type,
            'message' => $message,
        ]);
    }
}
?>
