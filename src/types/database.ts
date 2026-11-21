// Database types in the format produced by `supabase gen types typescript`.
// Regenerate from the live schema with `npm run db:types`.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          full_name: string;
          id: string;
          is_default: boolean;
          line1: string;
          line2: string | null;
          phone: string | null;
          postal_code: string;
          region: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country?: string;
          created_at?: string;
          full_name: string;
          id?: string;
          is_default?: boolean;
          line1: string;
          line2?: string | null;
          phone?: string | null;
          postal_code: string;
          region?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          full_name?: string;
          id?: string;
          is_default?: boolean;
          line1?: string;
          line2?: string | null;
          phone?: string | null;
          postal_code?: string;
          region?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          cart_id: string;
          created_at: string;
          id: string;
          quantity: number;
          saved_for_later: boolean;
          updated_at: string;
          variant_id: string;
        };
        Insert: {
          cart_id: string;
          created_at?: string;
          id?: string;
          quantity: number;
          saved_for_later?: boolean;
          updated_at?: string;
          variant_id: string;
        };
        Update: {
          cart_id?: string;
          created_at?: string;
          id?: string;
          quantity?: number;
          saved_for_later?: boolean;
          updated_at?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      carts: {
        Row: {
          created_at: string;
          discount_code: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          discount_code?: string | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          discount_code?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          position: number;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          position?: number;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          position?: number;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collection_products: {
        Row: {
          collection_id: string;
          position: number;
          product_id: string;
        };
        Insert: {
          collection_id: string;
          position?: number;
          product_id: string;
        };
        Update: {
          collection_id?: string;
          position?: number;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_alt: string | null;
          image_url: string | null;
          is_featured: boolean;
          name: string;
          position: number;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          tagline: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          name: string;
          position?: number;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          tagline?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          name?: string;
          position?: number;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          tagline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: Database["public"]["Enums"]["message_status"];
          subject: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: Database["public"]["Enums"]["message_status"];
          subject: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: Database["public"]["Enums"]["message_status"];
          subject?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "contact_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      discount_codes: {
        Row: {
          active: boolean;
          code: string;
          created_at: string;
          description: string | null;
          expires_at: string | null;
          id: string;
          min_order_cents: number;
          starts_at: string | null;
          times_used: number;
          type: Database["public"]["Enums"]["discount_type"];
          updated_at: string;
          usage_limit: number | null;
          value: number;
        };
        Insert: {
          active?: boolean;
          code: string;
          created_at?: string;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          min_order_cents?: number;
          starts_at?: string | null;
          times_used?: number;
          type: Database["public"]["Enums"]["discount_type"];
          updated_at?: string;
          usage_limit?: number | null;
          value?: number;
        };
        Update: {
          active?: boolean;
          code?: string;
          created_at?: string;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          min_order_cents?: number;
          starts_at?: string | null;
          times_used?: number;
          type?: Database["public"]["Enums"]["discount_type"];
          updated_at?: string;
          usage_limit?: number | null;
          value?: number;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          source: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          source?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          source?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          image_url: string | null;
          line_total: number;
          order_id: string;
          product_id: string | null;
          product_slug: string | null;
          product_title: string;
          quantity: number;
          sku: string | null;
          unit_price: number;
          variant_id: string | null;
          variant_title: string | null;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          line_total: number;
          order_id: string;
          product_id?: string | null;
          product_slug?: string | null;
          product_title: string;
          quantity: number;
          sku?: string | null;
          unit_price: number;
          variant_id?: string | null;
          variant_title?: string | null;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          line_total?: number;
          order_id?: string;
          product_id?: string | null;
          product_slug?: string | null;
          product_title?: string;
          quantity?: number;
          sku?: string | null;
          unit_price?: number;
          variant_id?: string | null;
          variant_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          note: string | null;
          order_id: string;
          status: Database["public"]["Enums"]["order_status"];
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          note?: string | null;
          order_id: string;
          status: Database["public"]["Enums"]["order_status"];
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          note?: string | null;
          order_id?: string;
          status?: Database["public"]["Enums"]["order_status"];
        };
        Relationships: [
          {
            foreignKeyName: "order_status_history_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          currency: string;
          discount_code: string | null;
          discount_total: number;
          email: string;
          id: string;
          order_number: string;
          paid_at: string | null;
          shipping_address: Json | null;
          shipping_method: Database["public"]["Enums"]["shipping_method"];
          shipping_total: number;
          status: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          subtotal: number;
          tax_total: number;
          total: number;
          tracking_carrier: string | null;
          tracking_number: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          discount_code?: string | null;
          discount_total?: number;
          email: string;
          id?: string;
          order_number?: string;
          paid_at?: string | null;
          shipping_address?: Json | null;
          shipping_method?: Database["public"]["Enums"]["shipping_method"];
          shipping_total?: number;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          subtotal: number;
          tax_total?: number;
          total: number;
          tracking_carrier?: string | null;
          tracking_number?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          currency?: string;
          discount_code?: string | null;
          discount_total?: number;
          email?: string;
          id?: string;
          order_number?: string;
          paid_at?: string | null;
          shipping_address?: Json | null;
          shipping_method?: Database["public"]["Enums"]["shipping_method"];
          shipping_total?: number;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          subtotal?: number;
          tax_total?: number;
          total?: number;
          tracking_carrier?: string | null;
          tracking_number?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string;
          created_at: string;
          height: number | null;
          id: string;
          position: number;
          product_id: string;
          storage_path: string | null;
          url: string;
          width: number | null;
        };
        Insert: {
          alt?: string;
          created_at?: string;
          height?: number | null;
          id?: string;
          position?: number;
          product_id: string;
          storage_path?: string | null;
          url: string;
          width?: number | null;
        };
        Update: {
          alt?: string;
          created_at?: string;
          height?: number | null;
          id?: string;
          position?: number;
          product_id?: string;
          storage_path?: string | null;
          url?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          compare_at_price: number | null;
          created_at: string;
          id: string;
          image_id: string | null;
          options: Json;
          position: number;
          price: number;
          product_id: string;
          sku: string;
          stock: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          compare_at_price?: number | null;
          created_at?: string;
          id?: string;
          image_id?: string | null;
          options?: Json;
          position?: number;
          price: number;
          product_id: string;
          sku: string;
          stock?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          compare_at_price?: number | null;
          created_at?: string;
          id?: string;
          image_id?: string | null;
          options?: Json;
          position?: number;
          price?: number;
          product_id?: string;
          sku?: string;
          stock?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "product_images";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          base_price: number;
          care: string;
          category_id: string | null;
          compare_at_price: number | null;
          created_at: string;
          description: string;
          id: string;
          is_featured: boolean;
          materials: string;
          published_at: string | null;
          search: unknown;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          status: Database["public"]["Enums"]["product_status"];
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          base_price: number;
          care?: string;
          category_id?: string | null;
          compare_at_price?: number | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_featured?: boolean;
          materials?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["product_status"];
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          base_price?: number;
          care?: string;
          category_id?: string | null;
          compare_at_price?: number | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_featured?: boolean;
          materials?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["product_status"];
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          hits: number;
          key: string;
          window_start: string;
        };
        Insert: {
          hits?: number;
          key: string;
          window_start: string;
        };
        Update: {
          hits?: number;
          key?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_name: string;
          body: string;
          created_at: string;
          id: string;
          product_id: string;
          rating: number;
          status: Database["public"]["Enums"]["review_status"];
          title: string;
          updated_at: string;
          user_id: string | null;
          verified: boolean;
        };
        Insert: {
          author_name: string;
          body: string;
          created_at?: string;
          id?: string;
          product_id: string;
          rating: number;
          status?: Database["public"]["Enums"]["review_status"];
          title: string;
          updated_at?: string;
          user_id?: string | null;
          verified?: boolean;
        };
        Update: {
          author_name?: string;
          body?: string;
          created_at?: string;
          id?: string;
          product_id?: string;
          rating?: number;
          status?: Database["public"]["Enums"]["review_status"];
          title?: string;
          updated_at?: string;
          user_id?: string | null;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      stock_notifications: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          notified_at: string | null;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          notified_at?: string | null;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          notified_at?: string | null;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stock_notifications_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      stripe_events: {
        Row: {
          id: string;
          order_id: string | null;
          processed_at: string;
          type: string;
        };
        Insert: {
          id: string;
          order_id?: string | null;
          processed_at?: string;
          type: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          processed_at?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stripe_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlists: {
        Row: {
          created_at: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      product_cards: {
        Row: {
          average_rating: number | null;
          category_id: string | null;
          category_name: string | null;
          category_slug: string | null;
          compare_at_price: number | null;
          created_at: string | null;
          glazes: string[] | null;
          hover_image_alt: string | null;
          hover_image_url: string | null;
          id: string | null;
          image_alt: string | null;
          image_url: string | null;
          is_featured: boolean | null;
          max_price: number | null;
          on_sale: boolean | null;
          price: number | null;
          published_at: string | null;
          review_count: number | null;
          search: unknown;
          sizes: string[] | null;
          slug: string | null;
          status: Database["public"]["Enums"]["product_status"] | null;
          subtitle: string | null;
          title: string | null;
          total_stock: number | null;
          variant_count: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_review_stats: {
        Row: {
          average_rating: number | null;
          five_star: number | null;
          four_star: number | null;
          one_star: number | null;
          product_id: string | null;
          review_count: number | null;
          three_star: number | null;
          two_star: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product_cards";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
      fulfil_checkout: {
        Args: { p_event_id: string; p_event_type: string; p_items: Json; p_order: Json };
        Returns: {
          already_processed: boolean;
          order_id: string;
          order_number: string;
        }[];
      };
      has_purchased: {
        Args: { p_product_id: string };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      order_status_can_change: {
        Args: {
          p_from: Database["public"]["Enums"]["order_status"];
          p_to: Database["public"]["Enums"]["order_status"];
        };
        Returns: boolean;
      };
      update_order_status: {
        Args: {
          p_note?: string;
          p_order_id: string;
          p_status: Database["public"]["Enums"]["order_status"];
          p_tracking_carrier?: string;
          p_tracking_number?: string;
        };
        Returns: Database["public"]["Tables"]["orders"]["Row"];
      };
      validate_discount_code: {
        Args: { p_code: string; p_subtotal: number };
        Returns: {
          code: string;
          min_order_cents: number;
          reason: string | null;
          type: Database["public"]["Enums"]["discount_type"] | null;
          valid: boolean;
          value: number;
        }[];
      };
    };
    Enums: {
      discount_type: "percentage" | "fixed" | "free_shipping";
      message_status: "new" | "read" | "archived";
      order_status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
      product_status: "draft" | "published" | "archived";
      review_status: "pending" | "approved" | "hidden";
      shipping_method: "standard" | "express";
      user_role: "customer" | "admin" | "demo_admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])> = (PublicSchema["Tables"] &
  PublicSchema["Views"])[T] extends { Row: infer R }
  ? R
  : never;

export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

export const Constants = {
  public: {
    Enums: {
      discount_type: ["percentage", "fixed", "free_shipping"],
      message_status: ["new", "read", "archived"],
      order_status: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      product_status: ["draft", "published", "archived"],
      review_status: ["pending", "approved", "hidden"],
      shipping_method: ["standard", "express"],
      user_role: ["customer", "admin", "demo_admin"],
    },
  },
} as const;
