This is a lightweight JavaScript solution to manage multi-language **Gutenberg template parts** without paying for additional plugins. It allows you to:

- Dynamically show/hide parts of a template based on the current Polylang language.
- Update the language switcher placeholder dynamically (e.g., "LAN" → "EN"/"ES").
---

## How It Works

1. **Language Detection**: Uses the global `PolylangLanguages` object to determine the current language.
2. **Template Parts Filter**: Hides all template part children that do not match the current language. Each part should have children with language-specific classes.
3. **Switcher Updates**: Updates the language switcher placeholder (`LAN`) and generates dynamic links to change language inside the active template part.

---

## Enqueue to prepare your theme to use this (please note that we need to expose the languages to the JS so for custom terms we will need to change/expand the category fix

```php
//Polylang custom switcher for JS
add_action('wp', function() {

    // Bail if Polylang is not active
    if (!function_exists('pll_the_languages')) {
        error_log('Polylang not detected at wp!');
        return;
    }

    // Enqueue our JS
    wp_enqueue_script(
        'lang',
        get_template_directory_uri() . '/assets/scripts/lang.js',
        [],
        null,
        true
    );

    // Expose Polylang languages to JS
    $languages = pll_the_languages(['raw' => 1]);
    if ($languages) {
		// category fix
    if (is_category()) {
        $term = get_queried_object();
        if ($term && isset($term->term_id)) {
            foreach ($languages as $lang => &$data) {
                $translated_id = pll_get_term($term->term_id, $lang);
                if ($translated_id) {
                    $translated_term = get_term($translated_id);
                    if ($translated_term) {
                        $data['current_term_slug'] = $translated_term->slug;
                        $data['current_term_link'] = get_term_link($translated_term);
                    }
                }
            }
        }
		}

        wp_localize_script(
            'lang',
            'PolylangLanguages',
            $languages
        );
        error_log('Polylang detected, lang.js enqueued with languages.');
    } else {
        error_log('Polylang detected, but no languages found.');
    }
});
```

## Required Gutenberg Structure

For this to work correctly, add the required classes to the parent of your content's container.

<img width="280" height="486" alt="Screenshot 2025-08-22 at 9 33 47 p m" src="https://github.com/user-attachments/assets/e3b93b0e-98c6-4b31-9e47-170902dfc4eb" />


For the language switcher, you need to create a menu and use a submenu:
1. Parent li item will show a placeholder "LAN" - the script is ignoring an image in case you are using a flag or icon
2. The children are each language, using whatever word you want. Mine are ES and EN. The links are just #

<img width="344" height="587" alt="Screenshot 2025-08-22 at 9 32 23 p m" src="https://github.com/user-attachments/assets/d67d8b19-d99c-4cd0-b599-9eee8673400f" />


**Notes:**

- Each group that corresponds to a language must have a class like `lang-part-xx` (`xx` = language code, e.g., `en`, `es`).
- `lang-hidden` class is used to hide all languages by default. The JS will show the correct one after page load.
- Gutenberg will add the `<div class="wp-block-template-part">` as a parent of your markup once you place your part inside a template to allow this snippet do its magic.



## CSS

Add this to your CSS file to hide all language parts initially to prevent flash-of-both:

```css
.lang-hidden {
  display: none;
}
```

---

## JavaScript Snippet
Check the lang.js file

---

## Summary

- Use **one template part** (`header`, `footer`, `sidebar`, etc.) containing all language versions as children.
- Add `.lang-part-xx` and `.lang-hidden` to all versions (yes, the editor will display the duplicates!).
- JS handles showing only the correct language part, and updates placeholders.
- No extra plugins required — pure JS + Gutenberg blocks + Polylang.

---

## Credits

Developed by Cynthia Lara — inspired by a long battle figuring out language template hacks in Gutenberg + Polylang.


