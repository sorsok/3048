use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main1() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1, 101);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read a line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

fn fib(n: i32) -> i32 {
    if n <= 1 {
        return 1;
    }
    fib(n - 1) + fib(n - 2)
}

fn main2() {
    loop {
        println!("Please input n");
        let mut input = String::new();

        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read a line");

        input = String::from(input.trim());

        let n = match input.parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        println!(
            "The {}th fibonacci number is: {}",
            input,
            fib(n).to_string()
        );
    }
}

fn main() {
    main2();
}
