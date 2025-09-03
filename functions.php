//NOTE: This is WIP, it is inconsistent as the enqueue sometimes comes too early. Currently exploring on the best approach. Will update this ASAP-.
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
