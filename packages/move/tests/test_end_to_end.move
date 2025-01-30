#[test_only]
module deployment_addr::test_end_to_end {
    use std::option;
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_std::debug;

    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::object::{Self};
    
    use aptos_token_objects::collection;
    use aptos_token_objects::token::Token;

    use deployment_addr::launchpad_double_whitelist;

    /// Category for allowlist mint stage
    const FCFS_ALLOWLIST_MINT_STAGE_CATEGORY: vector<u8> = b"FCFS allowlist mint stage";
    const GUARANTEED_ALLOWLIST_MINT_STAGE_CATEGORY: vector<u8> = b"Guaranteed allowlist mint stage";

    /// Category for public mint stage
    const PUBLIC_MINT_MINT_STAGE_CATEGORY: vector<u8> = b"Public mint stage";

    #[test(aptos_framework = @0x1, sender = @deployment_addr, user1 = @0x200, user2 = @0x201)]
    fun test_happy_path(
        aptos_framework: &signer,
        sender: &signer,
        user1: &signer,
        user2: &signer,
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);

        // current timestamp is 0 after initialization
        timestamp::set_time_has_started_for_testing(aptos_framework);
        account::create_account_for_test(user1_addr);
        account::create_account_for_test(user2_addr);
        coin::register<AptosCoin>(user1);

        launchpad_double_whitelist::init_module_for_test(sender);

        launchpad_double_whitelist::create_collection(
            sender,
            string::utf8(b"description"),
            string::utf8(b"name"),
            string::utf8(b"https://gateway.irys.xyz/manifest_id/collection.json"),
            10,
            option::some(10),
            option::some(3),
            option::some(vector[user1_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds()),
            option::some(timestamp::now_seconds() + 100),
            option::some(3),

            option::some(vector[user2_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds() + 200),
            option::some(timestamp::now_seconds() + 300),
            option::some(3),

            option::some(timestamp::now_seconds() + 500),
            option::some(timestamp::now_seconds() + 600),
            option::some(2),
            option::some(10),
        );
        let registry = launchpad_double_whitelist::get_registry();
        let collection_1 = *vector::borrow(&registry, vector::length(&registry) - 1);
        assert!(collection::count(collection_1) == option::some(3), 1);

        let mint_fee = launchpad_double_whitelist::get_mint_fee(collection_1, string::utf8(FCFS_ALLOWLIST_MINT_STAGE_CATEGORY), 1);
        aptos_coin::mint(aptos_framework, user1_addr, mint_fee);

        launchpad_double_whitelist::mint_nft(user1, collection_1, 1);

        let active_or_next_stage = launchpad_double_whitelist::get_active_or_next_mint_stage(collection_1);
        assert!(active_or_next_stage == option::some(string::utf8(GUARANTEED_ALLOWLIST_MINT_STAGE_CATEGORY)), 3);
        let (start_time, end_time) = launchpad_double_whitelist::get_mint_stage_start_and_end_time(
            collection_1,
            string::utf8(GUARANTEED_ALLOWLIST_MINT_STAGE_CATEGORY)
        );
        assert!(start_time == 0, 4);
        assert!(end_time == 100, 5);

        // bump global timestamp to 150 so allowlist stage is over but public mint stage is not started yet
        timestamp::update_global_time_for_test_secs(350);
        let active_or_next_stage = launchpad_double_whitelist::get_active_or_next_mint_stage(collection_1);
        assert!(active_or_next_stage == option::some(string::utf8(PUBLIC_MINT_MINT_STAGE_CATEGORY)), 6);
        let (start_time, end_time) = launchpad_double_whitelist::get_mint_stage_start_and_end_time(
            collection_1,
            string::utf8(PUBLIC_MINT_MINT_STAGE_CATEGORY)
        );
        assert!(start_time == 500, 7);
        assert!(end_time == 600, 8);

        // bump global timestamp to 550 so public mint stage is active
        timestamp::update_global_time_for_test_secs(550);
        let active_or_next_stage = launchpad_double_whitelist::get_active_or_next_mint_stage(collection_1);
        assert!(active_or_next_stage == option::some(string::utf8(PUBLIC_MINT_MINT_STAGE_CATEGORY)), 9);
        let (start_time, end_time) = launchpad_double_whitelist::get_mint_stage_start_and_end_time(
            collection_1,
            string::utf8(PUBLIC_MINT_MINT_STAGE_CATEGORY)
        );
        assert!(start_time == 500, 10);
        assert!(end_time == 600, 11);

        // bump global timestamp to 650 so public mint stage is over
        timestamp::update_global_time_for_test_secs(650);
        let active_or_next_stage = launchpad_double_whitelist::get_active_or_next_mint_stage(collection_1);
        assert!(active_or_next_stage == option::none(), 12);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, sender = @deployment_addr, user1 = @0x200)]
    #[expected_failure(abort_code = 12, location = launchpad_double_whitelist)]
    fun test_mint_disabled(
        aptos_framework: &signer,
        sender: &signer,
        user1: &signer,
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let user1_addr = signer::address_of(user1);

        // current timestamp is 0 after initialization
        timestamp::set_time_has_started_for_testing(aptos_framework);
        account::create_account_for_test(user1_addr);
        coin::register<AptosCoin>(user1);

        launchpad_double_whitelist::init_module_for_test(sender);

        launchpad_double_whitelist::create_collection(
            sender,
            string::utf8(b"description"),
            string::utf8(b"name"),
            string::utf8(b"https://gateway.irys.xyz/manifest_id/collection.json"),
            10,
            option::some(10),
            option::some(3),

            option::some(vector[user1_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds()),
            option::some(timestamp::now_seconds() + 100),
            option::some(3),

            option::some(vector[user1_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds() + 100),
            option::some(timestamp::now_seconds() + 200),
            option::some(3),

            option::some(timestamp::now_seconds() + 300),
            option::some(timestamp::now_seconds() + 400),
            option::some(2),
            option::some(10),
        );
        let registry = launchpad_double_whitelist::get_registry();
        let collection_1 = *vector::borrow(&registry, vector::length(&registry) - 1);

        assert!(launchpad_double_whitelist::is_mint_enabled(collection_1), 1);

        let mint_fee = launchpad_double_whitelist::get_mint_fee(collection_1, string::utf8(FCFS_ALLOWLIST_MINT_STAGE_CATEGORY), 1);
        aptos_coin::mint(aptos_framework, user1_addr, mint_fee);

        launchpad_double_whitelist::mint_nft(user1, collection_1, 1);

        launchpad_double_whitelist::update_mint_enabled(sender, collection_1, false);
        assert!(!launchpad_double_whitelist::is_mint_enabled(collection_1), 2);

        launchpad_double_whitelist::mint_nft(user1, collection_1, 1);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, sender = @deployment_addr, user1 = @0x200)]
    fun test_should_reveal_nft(
        aptos_framework: &signer,
        sender: &signer,
        user1: &signer,
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let user1_addr = signer::address_of(user1);

        // current timestamp is 0 after initialization
        timestamp::set_time_has_started_for_testing(aptos_framework);
        account::create_account_for_test(user1_addr);
        coin::register<AptosCoin>(user1);

        launchpad_double_whitelist::init_module_for_test(sender);

        launchpad_double_whitelist::create_collection(
            sender,
            string::utf8(b"description"),
            string::utf8(b"collection name"),
            string::utf8(b"https://gateway.irys.xyz/manifest_id/collection.json"),
            10,
            option::some(10),
            option::some(3),

            option::some(vector[user1_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds()),
            option::some(timestamp::now_seconds() + 100),
            option::some(3),

            option::some(vector[user1_addr]),
            option::some(vector[1]),
            option::some(timestamp::now_seconds() + 100),
            option::some(timestamp::now_seconds() + 200),
            option::some(3),

            option::some(timestamp::now_seconds() + 300),
            option::some(timestamp::now_seconds() + 400),
            option::some(2),
            option::some(10),
        );
        let registry = launchpad_double_whitelist::get_registry();
        let collection_1 = *vector::borrow(&registry, vector::length(&registry) - 1);

        assert!(launchpad_double_whitelist::is_mint_enabled(collection_1), 1);

        let mint_fee = launchpad_double_whitelist::get_mint_fee(collection_1, string::utf8(FCFS_ALLOWLIST_MINT_STAGE_CATEGORY), 1);
        aptos_coin::mint(aptos_framework, user1_addr, mint_fee);

        let nft_obj = launchpad_double_whitelist::test_mint_nft(user1_addr, collection_1);
        debug::print(&nft_obj);

        let token_name = &aptos_token_objects::token::name(nft_obj);
        debug::print(token_name);

        let name = string::utf8(b"name");
        let description = string::utf8(b"description");
        let uri = string::utf8(b"https://gateway.irys.xyz/manifest_id/test.jpg");
        let prop_names = vector[string::utf8(b"prop_name")];
        let prop_values = vector[string::utf8(b"prop_value")];
        
        launchpad_double_whitelist::reveal_nft(sender, collection_1, nft_obj, name, description, uri, prop_names, prop_values);

        // Also test update properties more than once
        launchpad_double_whitelist::reveal_nft(sender, collection_1, nft_obj, name, description, uri, prop_names, prop_values);

        let token_addr = object::object_address(&nft_obj);
        let token = object::address_to_object<Token>(token_addr);

        assert!(aptos_token_objects::token::name(token) == name, 2);
        assert!(aptos_token_objects::token::description(token) == description, 3);
        assert!(aptos_token_objects::token::uri(token) == uri, 4);
        
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
